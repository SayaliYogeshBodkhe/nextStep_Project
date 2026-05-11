import React, {
  useEffect,
  useState,
} from "react";

import "./resources.css";

function Resources() {
  const [resources, setResources] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

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
        matchSearch && matchCategory
      );
    }
  );

  const categories = [
    "All",
    ...new Set(
      resources.map((r) => r.category)
    ),
  ];

  return (
    <div className="resources-page">

      <h1 className="resource-heading">
        Learning Resources
      </h1>

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

      <div className="resource-grid">

        {filtered.map((item) => (
          <div
            className="resource-card"
            key={item._id}
          >

            <div className="resource-image-wrapper">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="resource-thumbnail"
              />
            </div>

            <div className="resource-content">

              <span className="resource-type">
                {item.type}
              </span>

              <h3>{item.title}</h3>

              <p>
                {item.description}
              </p>

              <div className="resource-meta">
                <span>
                  {item.category}
                </span>

                <span>
                  {item.difficulty}
                </span>
              </div>

              <div className="resource-tags">
                {item.tags?.map(
                  (tag, index) => (
                    <span key={index}>
                      #{tag}
                    </span>
                  )
                )}
              </div>

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
    </div>
  );
}

export default Resources;