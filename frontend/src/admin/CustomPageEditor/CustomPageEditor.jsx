import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useCustomPageStore from '../../stores/useCustomPageStore';
import useFlipbookStore from '../../stores/useFlipbookStore';
import IndexPageCard from './IndexPageCard';
import GalleryPageCard from './GalleryPageCard';
import './CustomPageEditor.scss';

const CustomPageEditor = () => {
  const { id } = useParams();
  const { customPages, loading, error, fetchCustomPages } = useCustomPageStore();
  const { getFlipbookById, loading: flipbookLoading } = useFlipbookStore();

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        await getFlipbookById(id);
        await fetchCustomPages(id);
      }
    };
    loadData();
  }, [id, getFlipbookById, fetchCustomPages]);

  const renderPageCard = (page) => {
    switch (page.pageType) {
      case 'IndexPage':
        return (
          <IndexPageCard
            key={`${page._id}-${page.pageNumber}`}
            pageData={page}
            pageNumber={page.pageNumber}
            loading={loading}
            flipbookId={id}
          />
        );
      case 'Gallery':
        return (
          <GalleryPageCard
            key={`${page._id}-${page.pageNumber}`}
            pageData={page}
            pageNumber={page.pageNumber}
            loading={loading}
            flipbookId={id}
          />
        );
      default:
        return null;
    }
  };

  if (loading || flipbookLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="custom-page-editor">
      <h2>Custom Pages Editor</h2>
      <div className="pages-container">
        {customPages.length === 0 ? (
          <div className="no-pages">
            <p>No custom pages available</p>
            <p>Add a custom page to get started</p>
          </div>
        ) : (
          customPages
            .sort((a, b) => a.pageNumber - b.pageNumber)
            .map(page => renderPageCard(page))
        )}
      </div>
    </div>
  );
};

export default CustomPageEditor; 