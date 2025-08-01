import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import net from 'net';
import Docker from 'dockerode';

const docker = new Docker();

const WS_PORT = 3001;

// 根据容器名获取容器内部IP地址
async function getContainerIp(containerName: string): Promise<string | null> {
    try {
        const container = docker.getContainer(containerName);
        const data = await container.inspect();
        // 默认桥接网络名叫 bridge，获取 IP
        // 可以根据实际网络名调整
        const networks = data.NetworkSettings.Networks;
        for (const netName in networks) {
            if (networks[netName]?.IPAddress) {
                return networks[netName].IPAddress;
            }
        }
        return null;
    } catch (error) {
        console.error(`Failed to get IP for container ${containerName}:`, error);
        return null;
    }
}

// 创建 TCP 连接到目标地址
function createTcpConnection(host: string, port: number): Promise<net.Socket> {
    return new Promise((resolve, reject) => {
        const socket = net.connect(port, host);
        socket.on('connect', () => resolve(socket));
        socket.on('error', (err) => reject(err));
    });
}

// 代理数据流，WS <-> TCP socket
function proxyStreams(ws: WebSocket, tcpSocket: net.Socket) {
    ws.on('message', (data) => {
        if (tcpSocket.writable) {
            tcpSocket.write(data as Buffer);
        }
    });
    tcpSocket.on('data', (chunk) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(chunk);
        }
    });

    ws.on('close', () => tcpSocket.end());
    ws.on('error', () => tcpSocket.end());
    tcpSocket.on('close', () => ws.close());
    tcpSocket.on('error', () => ws.close());
}

async function handleConnection(ws: WebSocket, path: string) {
    // path 形如 "/containerName"
    const containerName = path.startsWith('/') ? path.slice(1) : path;
    console.log(`Incoming WS connection for container: ${containerName}`);

    const ip = await getContainerIp(containerName);
    if (!ip) {
        console.error(`Cannot find IP for container ${containerName}`);
        ws.close(1011, 'Container not found');
        return;
    }

    try {
        const tcpSocket = await createTcpConnection(ip, 5901);
        proxyStreams(ws, tcpSocket);
        console.log(`Proxy established: WS -> ${ip}:5901`);
    } catch (err) {
        console.error(`TCP connection failed to ${ip}:5901`, err);
        ws.close(1011, 'Failed to connect to container VNC');
    }
}

async function start() {
    const server = http.createServer();

    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', handleConnection);

    server.on('upgrade', (request, socket, head) => {
        const { url } = request;
        if (!url) {
            socket.destroy();
            return;
        }

        // 你也可以做路径校验，比如限制前缀等
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, url);
        });
    });

    server.listen(WS_PORT, () => {
        console.log(`Websockify proxy server listening on ws://localhost:${WS_PORT}`);
    });
}

start().catch((e) => {
    console.error('Failed to start websockify proxy:', e);
    process.exit(1);
});
