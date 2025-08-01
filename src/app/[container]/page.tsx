'use client';

import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { VncScreen, VncScreenHandle } from 'react-vnc';

export default function ContainerPage() {
    const { container } = useParams();
    const containerName = Array.isArray(container) ? container[0] : container;

    const [status, setStatus] = useState<string>('connecting');
    const vncRef = useRef<VncScreenHandle>(null);

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${protocol}://${window.location.hostname}:3001/${containerName}`;

    return (
        <div className="flex flex-col h-screen">
            <div className="flex items-center justify-between bg-gray-800 text-white p-2">
                <span>Container: {containerName}</span>
                <span>Status: {status}</span>
            </div>
            <div className="flex-1 bg-black">
                <VncScreen
                    ref={vncRef}
                    url={wsUrl}
                    scaleViewport
                    resizeSession
                    background="#000"
                    style={{ width: '100%', height: '100%' }}
                    credentials={{ password: 'vncpassword' }}
                    rfbOptions={{ credentials: { password: 'vncpassword' } }}
                    shared
                    onConnect={() => setStatus('connected')}
                    onDisconnect={() => setStatus('disconnected')}
                    onCredentialsRequired={(rfb) => {
                        console.log('Credentials requested');
                        rfb.sendCredentials({ password: 'vncpassword' });
                    }}
                    onDesktopName={(e) =>
                        setStatus(`connected: ${e.detail.name}`)
                    }
                />
            </div>
            <div className="bg-gray-900 text-white p-2 flex justify-center gap-4">
                <button
                    className="px-4 py-1 bg-red-600 rounded"
                    onClick={() => vncRef.current?.disconnect()}
                >
                    Disconnect
                </button>
                <button
                    className="px-4 py-1 bg-green-600 rounded"
                    onClick={() => vncRef.current?.connect()}
                >
                    Connect
                </button>
            </div>
        </div>
    );
}
