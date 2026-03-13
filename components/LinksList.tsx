"use client";

import { Link as LucideLink } from "lucide-react";
import { useState } from "react";
import LinkCard from "./LinkCard";
import { Link } from "@/lib/types";

interface LinksListProps {
  links: Link[];
  updateLink: (id: string, updates: Partial<Link>) => void;
  deleteLink: (id: string) => void;
  reorderLinks: (newOrderedLinks: Link[]) => void;
}

export default function LinksList({ links, updateLink, deleteLink, reorderLinks }: LinksListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    const target = e.target as HTMLElement;
    setTimeout(() => { target.classList.add('opacity-50'); }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.classList.remove('opacity-50');
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (index !== dragOverIndex) setDragOverIndex(index);
  };

  const handleDragLeave = () => setDragOverIndex(null);

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = draggedIndex;
    if (dragIndex === null || dragIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newLinks = [...links];
    const [draggedItem] = newLinks.splice(dragIndex, 1);
    newLinks.splice(dropIndex, 0, draggedItem);

    if (reorderLinks) reorderLinks(newLinks);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-3">
      {links.length === 0 ? (
        <div className="text-center py-12 text-gray-400 dark:text-gray-50 transition-colors">
          <LucideLink className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No links yet. Click &quot;Create New Link&quot; to add your first link!</p>
        </div>
      ) : (
        links.map((link, index) => (
          <div
            key={`${link.id}-${link.enabled}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={`transition-all duration-200 ${dragOverIndex === index && draggedIndex !== index ? 'border-t-2 border-purple-500 pt-2' : ''} ${draggedIndex === index ? 'opacity-50' : ''}`}
          >
            <LinkCard
              link={link}
              isEditing={editingId === link.id}
              setEditing={(editing) => setEditingId(editing ? link.id : null)}
              updateLink={updateLink}
              deleteLink={deleteLink}
            />
          </div>
        ))
      )}
    </div>
  );
}

