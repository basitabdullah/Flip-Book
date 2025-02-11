import React from 'react';
import { useParams } from 'react-router-dom';
import useFlipbookStore from '../../stores/useFlipbookStore';
import CustomPageCard from './CustomPageCard';
import './CustomPageEditor.scss';

const CustomPageEditor = () => {
  const { id } = useParams();
  const { flipbook, loading, error } = useFlipbookStore();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!flipbook) return <div>No flipbook found</div>;

  // Filter for pages that are either custom or of type IndexPage
  const customPages = flipbook.pages?.filter(page => 
    page.isCustom || page.pageType === 'IndexPage'
  ) || [];

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
            .map(page => (
              <CustomPageCard
                key={`${page._id}-${page.pageNumber}`}
                pageData={page}
                pageNumber={page.pageNumber}
                loading={loading}
                flipbookId={id}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default CustomPageEditor; 