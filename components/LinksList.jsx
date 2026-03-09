"use client";

import { useState, useRef } from "react";

export default function LinksList({ links, updateLink, deleteLink }) {
  const [editingId, setEditingId] = useState(null);

  return (
    <div className="space-y-3">
      {links.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <p>No links yet. Click &quot;Add&quot; to create your first link!</p>
        </div>
      ) : (
        links.map((link) => (
          <LinkCard
            key={`${link.id}-${link.enabled}`}
            link={link}
            isEditing={editingId === link.id}
            setEditing={(editing) => setEditingId(editing ? link.id : null)}
            updateLink={updateLink}
            deleteLink={deleteLink}
          />
        ))
      )}
    </div>
  );
}

function LinkCard({ link, isEditing, setEditing, updateLink, deleteLink }) {
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [isEnabled, setIsEnabled] = useState(link.enabled);
  const isToggling = useRef(false);

  const handleSave = () => {
    updateLink(link.id, { title, url });
    setEditing(false);
  };

  const handleToggle = () => {
    if (isToggling.current) return;
    isToggling.current = true;
    
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    updateLink(link.id, { enabled: newEnabled });
    
    // Reset after a short delay
    setTimeout(() => {
      isToggling.current = false;
    }, 500);
  };

  return (
    <div className={`bg-gray-800 rounded-xl p-3 sm:p-4 group transition-all ${!isEnabled ? 'opacity-60' : ''}`}>
      {/* Drag Handle & Content */}
      <div className="flex items-start gap-2 sm:gap-3">
        {/* Drag Handle */}
        <div className="mt-2 cursor-grab text-gray-600 hover:text-gray-400 hidden sm:block">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 text-sm sm:text-base"
              />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="URL"
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 text-sm sm:text-base"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-3 sm:px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-medium text-sm sm:text-base truncate">{link.title}</h3>
                <button
                  onClick={() => setEditing(true)}
                  className="text-gray-500 hover:text-white transition-all flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm truncate">{link.url}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Toggle Switch */}
          <button
            onClick={handleToggle}
            className={`relative w-11 sm:w-12 h-6 rounded-full transition-colors duration-200 ${
              isEnabled ? "bg-green-500" : "bg-gray-600"
            }`}
            aria-label={isEnabled ? "Disable link" : "Enable link"}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                isEnabled ? "translate-x-6 sm:translate-x-7" : "translate-x-1"
              }`}
            />
          </button>

          {/* Delete */}
          <button
            onClick={() => deleteLink(link.id)}
            className="text-gray-500 hover:text-red-500 transition-all sm:opacity-0 sm:group-hover:opacity-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
