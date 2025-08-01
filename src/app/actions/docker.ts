// src/app/actions/docker.ts

'use server';

import Docker from 'dockerode';
import { revalidatePath } from 'next/cache';

export interface ContainerInfo {
    id: string;
    name: string;
    status: string;
    createdAt: string;
}

const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const IMAGE_NAME = 'consol/ubuntu-xfce-vnc';
const VNC_PASSWORD = 'vncpassword';

export async function listContainers(): Promise<ContainerInfo[]> {
    const containers = await docker.listContainers({ all: true });
    const result: ContainerInfo[] = [];

    for (const c of containers) {
        if (!c.Names[0]?.startsWith('/')) continue;
        const name = c.Names[0].replace(/^\//, '');
        const full = docker.getContainer(c.Id);
        const desc = await full.inspect();
        result.push({
            id: c.Id,
            name,
            status: c.State,
            createdAt: new Date(desc.Created).toLocaleString(),
        });
    }

    return result;
}

export async function createContainer(name: string): Promise<void> {
    await docker.createContainer({
        Image: IMAGE_NAME,
        name,
        Env: [`VNC_PASSWORD=${VNC_PASSWORD}`],
        HostConfig: { NetworkMode: 'bridge' },
    }).then((ctr) => ctr.start());

    revalidatePath('/');
}

export async function deleteContainer(id: string): Promise<void> {
    const ctr = docker.getContainer(id);
    try {
        await ctr.stop();
    } catch {}
    await ctr.remove();
    revalidatePath('/');
}
