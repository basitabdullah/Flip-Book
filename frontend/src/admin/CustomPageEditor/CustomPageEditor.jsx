import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useCustomPageStore from '../../stores/useCustomPageStore';
import useGalleryPageStore from '../../stores/useGalleryPageStore';
import useCatalogPageStore from '../../stores/useCatalogPageStore';
import useSocialPageStore from '../../stores/useSocialPageStore';
import useFlipbookStore from '../../stores/useFlipbookStore';
import IndexPageCard from './IndexPageCard';
import GalleryPageCard from './GalleryPageCard';
import CatalogPageCard from './CatalogPageCard';
import SocialPageCard from './SocialPageCard';
import './CustomPageEditor.scss';
import Loader from '../../components/Loader/Loader';

const CustomPageEditor = () => {
  const { id } = useParams();
  const { customPages, loading: indexLoading, error: indexError, fetchCustomPages } = useCustomPageStore();
  const { galleryPages, loading: galleryLoading, error: galleryError, fetchGalleryPages } = useGalleryPageStore();
  const { catalogPages, loading: catalogLoading, error: catalogError, fetchCatalogPages } = useCatalogPageStore();
  const { socialPages, loading: socialLoading, error: socialError, fetchSocialPages } = useSocialPageStore();
  const { getFlipbookById, loading: flipbookLoading } = useFlipbookStore();

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        await getFlipbookById(id);
        await fetchCustomPages(id);
        await fetchGalleryPages(id);
        await fetchCatalogPages(id);
        await fetchSocialPages(id);
      }
    };
    loadData();
  }, [id, getFlipbookById, fetchCustomPages, fetchGalleryPages, fetchCatalogPages, fetchSocialPages]);

  const pageTypes = [
    'IndexPage',
    'Gallery',
    'Catalog',
    'Social'
  ];

  const renderPageCard = (page) => {
    switch (page.pageType) {
      case 'IndexPage':
        return (
          <IndexPageCard
            key={`${page._id}-${page.pageNumber}`}
            pageData={page}
            pageNumber={page.pageNumber}
            loading={indexLoading}
            flipbookId={id}
          />
        );
      case 'Gallery':
        return (
          <GalleryPageCard
            key={`${page._id}-${page.pageNumber}`}
            pageData={page}
            pageNumber={page.pageNumber}
            loading={galleryLoading}
            flipbookId={id}
          />
        );
      case 'Catalog':
        return (
          <CatalogPageCard
            key={`${page._id}-${page.pageNumber}`}
            pageData={page}
            pageNumber={page.pageNumber}
            loading={catalogLoading}
            flipbookId={id}
          />
        );
      case 'Social':
        return (
          <SocialPageCard
            key={`${page._id}-${page.pageNumber}`}
            pageData={page}
            pageNumber={page.pageNumber}
            loading={socialLoading}
            flipbookId={id}
          />
        );
      default:
        return null;
    }
  };

  if (indexLoading || galleryLoading || catalogLoading || flipbookLoading || socialLoading) return <Loader/>;
  if (indexError || galleryError || catalogError || socialError) return <div>Error: {indexError || galleryError || catalogError || socialError}</div>;

  const allPages = [...customPages, ...galleryPages, ...catalogPages, ...socialPages].sort((a, b) => a.pageNumber - b.pageNumber);

  if (!allPages || allPages.length === 0) {
    return (
      <div className="no-pages-message">
        <p>No custom pages available</p>
        <p>Add an Index, Gallery, Social or Catalog page to get started</p>
      </div>
    );
  }

  return (
    <div className="custom-page-editor">
      <h2>Custom Pages Editor</h2>
      <div className="pages-container">
        {allPages.map(renderPageCard)}
      </div>
    </div>
  );
};

export default CustomPageEditor; 