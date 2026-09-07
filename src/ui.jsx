import React, { useEffect, useRef } from 'react';

const paths = {
  today: 'M3 11 12 3l9 8M5 9v12h14V9M9 21v-7h6v7',
  progress: 'M4 20V10m8 10V4m8 16v-7M2 21h20',
  learn: 'M12 5c-3-3-7-3-10-1v15c3-2 7-2 10 1 3-3 7-3 10-1V4c-3-2-7-2-10 1Zm0 0v15',
  program: 'M5 3v4M19 3v4M3 10h18M4 5h16v16H4zM8 14h2m4 0h2m-8 4h2',
  settings: 'M4 6h16M4 12h16M4 18h16M8 3v6m8 0v6m-6 0v6',
  check: 'm5 12 4 4L19 6',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  clock: 'M12 8v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18',
  weight: 'M2 9v6m3-9v12m14-12v12m3-9v6M5 12h14',
  save: 'M4 3h13l3 3v15H4zM8 3v6h8V3M8 21v-7h8v7',
  close: 'm6 6 12 12M6 18 18 6',
  star: 'm12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z',
  download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
};
export function Icon({ name, size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.star} />
    </svg>
  );
}
export function Spotter({ happy = false, className = '' }) {
  return (
    <svg className={`spotter ${className}`} viewBox="0 0 160 145" fill="none" aria-hidden="true">
      <ellipse cx="81" cy="132" rx="48" ry="7" fill="#382b4220" />
      <path
        d="M52 90 46 124h24l10-20 12 20h24l-7-34"
        fill="#b7acd2"
        stroke="#403549"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="52" cy="32" r="17" fill="#ecd5a7" stroke="#403549" strokeWidth="3" />
      <circle cx="107" cy="32" r="17" fill="#ecd5a7" stroke="#403549" strokeWidth="3" />
      <path
        d="M41 66c0-27 16-43 39-43s40 16 40 43v14c0 22-18 31-40 31S41 102 41 80Z"
        fill="#ecd5a7"
        stroke="#403549"
        strokeWidth="3"
      />
      <ellipse cx="61" cy="73" rx="9" ry="5" fill="#e7a9a1" />
      <ellipse cx="101" cy="73" rx="9" ry="5" fill="#e7a9a1" />
      {happy ? (
        <path
          d="m56 59 5-4 5 4m29 0 5-4 5 4"
          stroke="#403549"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ) : (
        <>
          <circle cx="61" cy="59" r="3" fill="#403549" />
          <circle cx="100" cy="59" r="3" fill="#403549" />
        </>
      )}
      <path
        d="M74 66h13l-6 6Zm-1 9q1 9 10 0"
        fill="#403549"
        stroke="#403549"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M29 91h103M22 81v20m10-25v29m92-29v29m11-24v20"
        stroke="#403549"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path d="M55 86v9m50-9v9" stroke="#ecd5a7" strokeWidth="13" strokeLinecap="round" />
      {happy && (
        <path
          d="m22 22 3-8 3 8 8 3-8 3-3 8-3-8-8-3Zm110 14 2-6 2 6 6 2-6 2-2 6-2-6-6-2Z"
          fill="#bb733f"
        />
      )}
    </svg>
  );
}
export function Button({ children, variant = 'primary', icon, className = '', ...props }) {
  return (
    <button type="button" className={`button ${variant} ${className}`} {...props}>
      {icon && <Icon name={icon} />} {children}
    </button>
  );
}
export function Field({ label, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}
export function Modal({ title, children, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="modal-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="modal-head">
        <h2 id="modal-title">{title}</h2>
        <button type="button" className="icon-button" aria-label="Close dialog" onClick={onClose}>
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Message({ children, error = false }) {
  return children ? (
    <div className={`message ${error ? 'error' : ''}`} role={error ? 'alert' : 'status'}>
      {children}
    </div>
  ) : null;
}
