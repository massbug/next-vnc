// src/app/actions/docker.ts

'use server';

import Docker from 'dockerode';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { containers } from '@/db/schema';
import { eq } from 'drizzle-orm';

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
    const container = await docker.createContainer({
        Image: IMAGE_NAME,
        name,
        Env: [`VNC_PASSWORD=${VNC_PASSWORD}`],
        HostConfig: { NetworkMode: 'bridge' },
    });
    
    await container.start();
    
    // 将容器信息保存到数据库
    await db.insert(containers).values({
        id: container.id,
        name: name,
    });

    revalidatePath('/');
}

export async function deleteContainer(id: string): Promise<void> {
    const ctr = docker.getContainer(id);
    try {
        await ctr.stop();
    } catch {}
    await ctr.remove();
    
    // 从数据库中删除容器信息
    await db.delete(containers).where(eq(containers.id, id));
    
    revalidatePath('/');
}