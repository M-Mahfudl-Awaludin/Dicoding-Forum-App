import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { asyncAddThread } from '../state/threads/action';
import './CreateThreadPage.css';

function CreateThreadPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state);

  React.useEffect(() => {
    if (!authUser) {
      navigate('/login');
    }
  }, [authUser, navigate]);

  const categories = ['General', 'Technology', 'Science', 'Arts', 'Sports', 'Politics', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !body.trim()) {
      setError('Judul dan isi thread harus diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const thread = await dispatch(asyncAddThread({
        title: title.trim(),
        body: body.trim(),
        category: category || undefined,
      }));
      if (thread && thread.id) {
        navigate(`/threads/${thread.id}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Gagal membuat thread. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authUser) {
    return null;
  }

  return (
    <div className="create-thread-page">
      <div className="create-thread-container">
        <div className="create-thread-card">
          <h1 className="create-thread-title">Buat Thread Baru</h1>

          {error && (
            <div className="create-thread-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="create-thread-form">
            <div className="form-group">
              <label htmlFor="title">Judul Thread</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Masukkan judul thread"
                className="form-input"
                maxLength="200"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Kategori (Opsional)</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="body">Isi Thread</label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                placeholder="Tulis isi thread Anda..."
                className="form-textarea"
                rows="10"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="cancel-button"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? 'Membuat...' : 'Buat Thread'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateThreadPage;
