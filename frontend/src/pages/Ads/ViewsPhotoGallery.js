import React, { useCallback, useState } from 'react'
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
export default function ViewsPhotoGallery({photos}) {
    const [current, setCurrent] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
 
    const openLightbox = useCallback((event, { photo, index }) => {
        setCurrent(index);
        setIsOpen(true);
      }, []);
    
      const closeLightbox = () => {
        setCurrent(0);
        setIsOpen(false);
      };  
      
  return (
    <div> 
 <Gallery photos={photos} onClick={openLightbox} />

<ModalGateway>
        {isOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel
              currentIndex={current}
              views={photos} 
            />
          </Modal>
        ) : null}
</ModalGateway>

    </div>
  )
}
