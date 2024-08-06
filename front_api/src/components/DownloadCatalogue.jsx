// DownloadCatalogue.jsx

import Base_API from "../Data/Base_API";

const DownloadCatalogue = () => (
  <section className="d-flex align-items-center justify-content-center mt-5">
    <a className="btn btn-info" href={`${Base_API}/catalogue/Catalogue_de_formation_2024.pdf`} download="Catalogue_de_formation_2024.pdf" title="Découvrez notre catalogue de formations" target="_blank">
      Téléchargez notre catalogue complet de formations.
    </a>
  </section>
);

export default DownloadCatalogue;
