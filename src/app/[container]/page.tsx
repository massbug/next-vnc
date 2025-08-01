'use client';

import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { VncScreen, VncScreenHandle } from 'react-vnc';
import type RFB from '@novnc/novnc/lib/rfb';

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
                    style={{ width: '100%', height: '100%', backgroundColor: '#000000' }}
                    rfbOptions={{ credentials: {
                            password: 'vncpassword',
                            username: '',
                            target: ''
                        } }}
                    onConnect={() => setStatus('connected')}
                    onDisconnect={() => setStatus('disconnected')}
                    onCredentialsRequired={(event: CustomEvent<{ types: ('username' | 'password' | 'target')[] }>) => {
                        console.log('Credentials requested');

                        const target = event.target as EventTarget & { rfb?: RFB };

                        if (target.rfb && typeof target.rfb.sendCredentials === 'function') {
                            target.rfb.sendCredentials({
                                username: '',
                                password: 'vncpassword',
                                target: ''
                            });
                        } else {
                            console.warn('rfb or sendCredentials not available');
                        }
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
