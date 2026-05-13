import React, {
  useEffect,
  useState,
} from "react";

import "./resources.css";

/* IMPORT NAVBAR */
import Navbar from "../components/Navbar";

function Resources() {

  const [resources, setResources] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");
    const [currentPage, setCurrentPage] =
  useState(1);

  const itemsPerPage = 6;

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {

    const res = await fetch(
      "http://localhost:5000/getResources"
    );

    const data = await res.json();

    if (data.status === "ok") {
      setResources(data.data);
    }
  };

  const filtered = resources.filter(
    (r) => {

      const matchSearch =
        r.title
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchCategory =
        category === "All" ||
        r.category === category;

      return (
        matchSearch &&
        matchCategory
      );
    }
  );
  const lastIndex =
  currentPage * itemsPerPage;

const firstIndex =
  lastIndex - itemsPerPage;

const currentItems =
  filtered.slice(
    firstIndex,
    lastIndex
  );

const totalPages = Math.ceil(
  filtered.length / itemsPerPage
);

  const categories = [
    "All",

    ...new Set(
      resources.map(
        (r) => r.category
      )
    ),
  ];

  return (
    <>

      {/* NAVBAR */}
      <Navbar />

      <div className="resources-page">

        <h1 className="resource-heading">
          Learning Resources
        </h1>

        {/* SEARCH */}
        <div className="resource-top">

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* CATEGORY FILTER */}
        <div className="category-bar">

          {categories.map((cat, i) => (

            <button
              key={i}
              className={
                category === cat
                  ? "active-cat"
                  : ""
              }

              onClick={() =>
                setCategory(cat)
              }
            >
              {cat}
            </button>

          ))}

        </div>

        {/* RESOURCE GRID */}
        <div className="resource-grid">

          {currentItems.map((item) => (

            <div
              className="resource-card"
              key={item._id}
            >

              {/* IMAGE */}
              <div className="resource-image-wrapper">

                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="resource-thumbnail"
                />

              </div>

              {/* CONTENT */}
              <div className="resource-content">

                <span className="resource-type">
                  {item.type}
                </span>

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.description}
                </p>

                {/* META */}
                <div className="resource-meta">

                  <span>
                    {item.category}
                  </span>

                  <span>
                    {item.difficulty}
                  </span>

                </div>

                {/* TAGS */}
                <div className="resource-tags">

                  {item.tags?.map(
                    (tag, index) => (

                      <span key={index}>
                        #{tag}
                      </span>

                    )
                  )}

                </div>

                {/* BUTTON */}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="resource-btn"
                >
                  Open Resource
                </a>

              </div>

            </div>

          ))}

        </div>
        {/* PAGINATION */}

<div className="pagination">

  <button
    disabled={currentPage === 1}
    onClick={() =>
      setCurrentPage(currentPage - 1)
    }
  >
    Prev
  </button>

  {[...Array(totalPages)].map(
    (_, index) => (

      <button
        key={index}

        className={
          currentPage === index + 1
            ? "active-page"
            : ""
        }

        onClick={() =>
          setCurrentPage(index + 1)
        }
      >
        {index + 1}
      </button>

    )
  )}

  <button
    disabled={
      currentPage === totalPages
    }

    onClick={() =>
      setCurrentPage(currentPage + 1)
    }
  >
    Next
  </button>

</div>

      </div>

    </>
  );
}

export default Resources;