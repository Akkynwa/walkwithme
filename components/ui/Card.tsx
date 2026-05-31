import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ children, hover = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`
        bg-white dark:bg-slate-800 rounded-lg shadow-md p-6
        ${hover ? 'hover:shadow-lg transition-shadow' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
