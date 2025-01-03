import React from 'react';

interface TimelineNodeFieldsProps {
  isEditing: boolean;
  editedLabel: string;
  editedSubtitle: string;
  editedYear: string;
  setEditedLabel: (value: string) => void;
  setEditedSubtitle: (value: string) => void;
  setEditedYear: (value: string) => void;
  handleBlur: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleDoubleClick: (e: React.MouseEvent) => void;
  data: {
    label: string;
    subtitle: string;
    year: string;
  };
}

export const TimelineNodeFields = ({
  isEditing,
  editedLabel,
  editedSubtitle,
  editedYear,
  setEditedLabel,
  setEditedSubtitle,
  setEditedYear,
  handleBlur,
  handleKeyDown,
  handleDoubleClick,
  data,
}: TimelineNodeFieldsProps) => {
  if (isEditing) {
    return (
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={editedLabel}
          onChange={(e) => setEditedLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="font-medium text-gray-900 border border-gray-300 rounded px-2 py-1"
          autoFocus
        />
        <input
          type="text"
          value={editedSubtitle}
          onChange={(e) => setEditedSubtitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-sm text-gray-500 border border-gray-300 rounded px-2 py-1"
        />
        <input
          type="text"
          value={editedYear}
          onChange={(e) => setEditedYear(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-xs text-gray-400 border border-gray-300 rounded px-2 py-1"
        />
      </div>
    );
  }

  return (
    <div onDoubleClick={handleDoubleClick}>
      <h3 className="font-medium text-gray-900">{data.label}</h3>
      <p className="text-sm text-gray-500">{data.subtitle}</p>
      <p className="text-xs text-gray-400">{data.year}</p>
    </div>
  );
};