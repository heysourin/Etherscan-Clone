import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { Bean, Beans } from "@web3uikit/icons";
import { Illustration } from "@web3uikit/core";

const Search = () => {
  const [shoeResult, setShowResult] = useState(false);
  const [result, setResult] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const changeHandler = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = async () => {
    document.querySelector("#inputField").value = "";
    const response = await axios.get("http://localhost:5001/address", {
      params: { address: searchInput }, //input-> changeHandler -> useState, searchInput -> backend handlesearch
    });

    setResult(response.data.result);
    shoeResult(true);
  };

  return (
    <section className={styles.searchContainer}>
      <section className={styles.searchHeader}>
        <section className={styles.searchSection}>
          <h3>The Ethereum Blockchain Explorer</h3>
          <section className={styles.input_section}>
            <input
              type="text"
              className={styles.inputField}
              id="inputField"
              name="inputField"
              maxLength="120"
              placeholder="Seach by Address/ Tx Hash/ Block/ Token/ Domain Name"
              required
              onChange={changeHandler}
            />
            <button className={styles.btn} onClick={handleSearch}>
              🔍
            </button>
          </section>
          <section className={styles.sponsored}>
            Made with passion by @heysourin{" "}
            <span className={styles.bean}>
              <Bean fontSize="20px" />
            </span>
          </section>

        </section>
        <section className={styles.adSection}>
          <p className={styles.adtext}>Links</p>
          <section>
            <Beans fontSize="50px" className={styles.float} />
            <Illustration logo="wizard" className={styles.wizard} />
          </section>
        </section>
      </section>
    </section>
  );
};

export default Search;
