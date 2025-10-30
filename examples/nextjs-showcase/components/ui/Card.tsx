import React from 'react';

interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export function Card({
  title,
  description,
  children,
  className = '',
  headerAction,
}: CardProps) {
  return (
    <div className={`bg-white rounded-xl border shadow-sm ${className}`}>
      {(title || description || headerAction) && (
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
              {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
