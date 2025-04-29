import { Transcript } from "./Transcript";

export function Modal({ student, isOpen, closeModal }) {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                flexDirection: 'column',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}
            onClick={closeModal}
        >
            <Transcript student={student} />
            <button
                onClick={closeModal}
                style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    fontSize: '40px',
                    fontWeight: 'bold',
                }}
            >
                ×
            </button>
        </div>
    );
}