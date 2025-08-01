'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import {
    createContainer,
    deleteContainer,
    listContainers,
    ContainerInfo,
} from './actions/docker';

export default function HomePage() {
    const [containers, setContainers] = useState<ContainerInfo[]>([]);
    const [name, setName] = useState('');
    const [creating, setCreating] = useState(false);

    const refresh = async () => {
        const list = await listContainers();
        setContainers(list);
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setCreating(true);
        await createContainer(name.trim());
        setName('');
        await refresh();
        setCreating(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('确认删除容器？')) return;
        await deleteContainer(id);
        await refresh();
    };

    return (
        <main className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">VNC 容器管理平台</h1>

            <form className="flex gap-2 mb-6" onSubmit={handleCreate}>
                <input
                    className="flex-grow border rounded p-2"
                    placeholder="容器名称"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={creating}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {creating ? '创建中...' : '创建容器'}
                </button>
            </form>

            <table className="w-full table-auto border-collapse">
                <thead>
                <tr className="bg-gray-200">
                    <th className="border px-2 py-1">名称</th>
                    <th className="border px-2 py-1">状态</th>
                    <th className="border px-2 py-1">创建时间</th>
                    <th className="border px-2 py-1">操作</th>
                </tr>
                </thead>
                <tbody>
                {containers.map((c) => (
                    <tr key={c.id}>
                        <td className="border px-2 py-1">
                            <Link
                                href={`/${c.name}`}
                                className="text-blue-600 hover:underline"
                            >
                                {c.name}
                            </Link>
                        </td>
                        <td className="border px-2 py-1">{c.status}</td>
                        <td className="border px-2 py-1">{c.createdAt}</td>
                        <td className="border px-2 py-1 space-x-2">
                            <button
                                className="text-red-600 hover:underline"
                                onClick={() => handleDelete(c.id)}
                            >
                                删除
                            </button>
                        </td>
                    </tr>
                ))}
                {containers.length === 0 && (
                    <tr>
                        <td
                            colSpan={4}
                            className="border px-2 py-1 text-center text-gray-500"
                        >
                            暂无容器，可创建新容器
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </main>
    );
}
