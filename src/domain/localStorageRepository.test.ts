import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageRepository } from './localStorageRepository';

describe('LocalStorageRepository', () => {
  let repo: LocalStorageRepository;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalStorageRepository();
  });

  it('returns empty object when localStorage is empty', () => {
    expect(repo.getAll()).toEqual({});
  });

  it('returns empty object when localStorage has malformed JSON', () => {
    localStorage.setItem('pao-major-system', '{not valid json');
    expect(repo.getAll()).toEqual({});
  });

  it('returns undefined for getOne with nonexistent key', () => {
    expect(repo.getOne('42')).toBeUndefined();
  });

  it('saveCard persists and retrieves a single card', () => {
    const entry = { persona: 'A', action: 'B', object: 'C', image: 'D' };
    repo.saveCard('05', entry);
    expect(repo.getOne('05')).toEqual(entry);
  });

  it('importAll overwrites all existing data', () => {
    repo.saveCard('01', { persona: 'old', action: '', object: '', image: '' });
    const newData = { '50': { persona: 'new', action: 'a', object: 'o', image: 'i' } };
    repo.importAll(newData);
    expect(repo.getAll()).toEqual(newData);
    expect(repo.getOne('01')).toBeUndefined();
  });
});
