import { useState, useEffect, useCallback } from 'react';
import { DeckEntry } from '../types';
import { getConsonants } from '../utils/majorSystem';

interface EditModalProps {
  isOpen: boolean;
  cardNum: number | string | null;
  entry: Partial<DeckEntry>;
  onSave: (num: number | string, entry: DeckEntry) => void;
  onClose: () => void;
}

export default function EditModal({ isOpen, cardNum, entry, onSave, onClose }: EditModalProps) {
  const [persona, setPersona] = useState<string>('');
  const [action, setAction] = useState<string>('');
  const [object, setObject] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [imageError, setImageError] = useState<boolean>(false);

  // Sync form fields when cardNum/entry changes
  useEffect(() => {
    if (isOpen) {
      setPersona(entry?.persona || '');
      setAction(entry?.action || '');
      setObject(entry?.object || '');
      setImage(entry?.image || '');
      setImageError(false);
    }
  }, [isOpen, cardNum, entry]);

  const handleSave = useCallback(() => {
    if (cardNum == null) return;
    onSave(cardNum, {
      persona: persona.trim(),
      action: action.trim(),
      object: object.trim(),
      image: image.trim(),
    });
  }, [cardNum, persona, action, object, image, onSave]);

  // Keyboard event listeners: Enter to save, Escape to close
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter') handleSave();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleSave]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setImage(text);
      setImageError(false);
    } catch {
      /* clipboard not available */
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  const numStr = cardNum != null ? String(cardNum).padStart(2, '0') : '00';
  const num: number = typeof cardNum === 'string' ? parseInt(cardNum, 10) : (cardNum ?? 0);
  const { label } = getConsonants(num);
  const trimmedImage = image.trim();

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>#{numStr} — Editar PAO</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="consonants-info">Consoantes: {label}</div>

          <div className="pao-image-section">
            <div className="image-preview">
              {trimmedImage ? (
                imageError ? (
                  <span className="image-placeholder">❌</span>
                ) : (
                  <img
                    src={trimmedImage}
                    alt="Preview"
                    onError={() => setImageError(true)}
                  />
                )
              ) : (
                <span className="image-placeholder">📷</span>
              )}
            </div>
            <div className="image-input-row">
              <input
                type="text"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                  setImageError(false);
                }}
                placeholder="URL da imagem"
              />
              <button className="btn-paste" onClick={handlePaste}>📋</button>
            </div>
          </div>

          <div className="pao-fields">
            <label>
              🧑 Pessoa
              <input
                type="text"
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
              />
            </label>
            <label>
              ⚡ Ação
              <input
                type="text"
                value={action}
                onChange={(e) => setAction(e.target.value)}
              />
            </label>
            <label>
              🎯 Objeto
              <input
                type="text"
                value={object}
                onChange={(e) => setObject(e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-save" onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
