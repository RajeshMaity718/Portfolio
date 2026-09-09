```javascript
/* =========================================================
   PORTFOLIO STUDIO - JAVASCRIPT
   FIXED & CLEAN VERSION
   ========================================================= */


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let sectionsContainer;
let portfolioNameInput;
let savedName;
let headlineInput;
let descriptionInput;
let previewDescription;
let editorTitle;

let draggedSection = null;


/* =========================================================
   INITIALIZE DOM ELEMENTS
   ========================================================= */

function initializeElements() {

    sectionsContainer =
        document.getElementById("sections");

    portfolioNameInput =
        document.getElementById("portfolioName");

    savedName =
        document.getElementById("savedName");

    headlineInput =
        document.getElementById("headline");

    descriptionInput =
        document.getElementById("description");

    previewDescription =
        document.getElementById("previewDescription");

    editorTitle =
        document.getElementById("editorTitle");
}


/* =========================================================
   SELECT SECTION
   ========================================================= */

function selectSection(section) {

    if (!section) {
        return;
    }

    const allSections =
        document.querySelectorAll(".section");

    allSections.forEach(function (item) {
        item.classList.remove("selected");
    });

    section.classList.add("selected");

    const titleElement =
        section.querySelector("b");

    if (!titleElement) {
        return;
    }

    const sectionName =
        titleElement.textContent.trim();

    if (editorTitle) {
        editorTitle.textContent =
            "Edit " + sectionName;
    }
}


/* =========================================================
   ADD SECTION CLICK EVENTS
   ========================================================= */

function addSectionClickEvent(section) {

    if (!section) {
        return;
    }

    section.addEventListener("click", function () {
        selectSection(this);
    });
}


/* =========================================================
   DRAG AND DROP
   ========================================================= */

function enableDragAndDrop() {

    if (!sectionsContainer) {
        return;
    }

    const sections =
        sectionsContainer.querySelectorAll(".section");

    sections.forEach(function (section) {

        /* Prevent duplicate listeners */
        if (section.dataset.dragEnabled === "true") {
            return;
        }

        section.dataset.dragEnabled = "true";

        section.addEventListener(
            "dragstart",
            function () {

                draggedSection = this;

                this.classList.add("dragging");
            }
        );

        section.addEventListener(
            "dragend",
            function () {

                this.classList.remove("dragging");

                draggedSection = null;

                saveSections();
            }
        );

        section.addEventListener(
            "dragover",
            function (event) {

                event.preventDefault();

                if (
                    !draggedSection ||
                    draggedSection === this
                ) {
                    return;
                }

                const rect =
                    this.getBoundingClientRect();

                const middle =
                    rect.top + rect.height / 2;

                if (event.clientY < middle) {

                    sectionsContainer.insertBefore(
                        draggedSection,
                        this
                    );

                } else {

                    sectionsContainer.insertBefore(
                        draggedSection,
                        this.nextSibling
                    );
                }
            }
        );

        addSectionClickEvent(section);
    });
}


/* =========================================================
   SAVE SECTION ORDER
   ========================================================= */

function saveSections() {

    if (!sectionsContainer) {
        return;
    }

    const sections =
        sectionsContainer.querySelectorAll(".section");

    const sectionData = [];

    sections.forEach(function (section, index) {

        const nameElement =
            section.querySelector("b");

        const descriptionElement =
            section.querySelector("small");

        sectionData.push({

            name: nameElement
                ? nameElement.textContent.trim()
                : "Section",

            description: descriptionElement
                ? descriptionElement.textContent.trim()
                : "",

            order: index + 1
        });
    });

    localStorage.setItem(
        "portfolio_sections",
        JSON.stringify(sectionData)
    );
}


/* =========================================================
   LOAD SECTION ORDER
   ========================================================= */

function loadSections() {

    if (!sectionsContainer) {
        return;
    }

    const saved =
        localStorage.getItem("portfolio_sections");

    if (!saved) {
        return;
    }

    try {

        const savedSections =
            JSON.parse(saved);

        if (!Array.isArray(savedSections)) {
            return;
        }

        const currentSections =
            Array.from(
                sectionsContainer.querySelectorAll(".section")
            );

        savedSections
            .sort(function (a, b) {
                return a.order - b.order;
            })
            .forEach(function (savedSection) {

                const section =
                    currentSections.find(function (item) {

                        const nameElement =
                            item.querySelector("b");

                        return (
                            nameElement &&
                            nameElement.textContent.trim() ===
                            savedSection.name
                        );
                    });

                if (section) {

                    sectionsContainer.appendChild(
                        section
                    );
                }
            });

    } catch (error) {

        console.error(
            "Could not load sections:",
            error
        );
    }
}


/* =========================================================
   LIVE HEADLINE PREVIEW
   ========================================================= */

function updateHeadlinePreview() {

    if (!headlineInput) {
        return;
    }

    const previewTitle =
        document.querySelector(".preview-hero h2");

    if (!previewTitle) {
        return;
    }

    const value =
        headlineInput.value.trim();

    if (value === "") {

        previewTitle.innerHTML =
            "Creative<br><i>Developer.</i>";

        return;
    }

    const words =
        value.split(/\s+/);

    if (words.length >= 2) {

        const firstPart =
            escapeHTML(
                words.slice(0, -1).join(" ")
            );

        const lastWord =
            escapeHTML(
                words[words.length - 1]
            );

        previewTitle.innerHTML =
            firstPart +
            "<br><i>" +
            lastWord +
            "</i>";

    } else {

        previewTitle.textContent =
            value;
    }
}


/* =========================================================
   LIVE DESCRIPTION PREVIEW
   ========================================================= */

function updateDescriptionPreview() {

    if (!descriptionInput) {
        return;
    }

    if (!previewDescription) {
        return;
    }

    const value =
        descriptionInput.value.trim();

    previewDescription.textContent =
        value ||
        "I build modern, useful and beautiful digital experiences.";
}


/* =========================================================
   UPDATE PORTFOLIO NAME
   ========================================================= */

function updatePortfolioName() {

    if (!portfolioNameInput) {
        return;
    }

    if (!savedName) {
        return;
    }

    const value =
        portfolioNameInput.value.trim();

    savedName.textContent =
        value ||
        "My Developer Portfolio";
}


/* =========================================================
   GET CURRENT SECTIONS
   ========================================================= */

function getSectionsData() {

    if (!sectionsContainer) {
        return [];
    }

    const sections =
        sectionsContainer.querySelectorAll(".section");

    return Array.from(sections).map(
        function (section, index) {

            const nameElement =
                section.querySelector("b");

            const descriptionElement =
                section.querySelector("small");

            return {

                name: nameElement
                    ? nameElement.textContent.trim()
                    : "Section",

                description: descriptionElement
                    ? descriptionElement.textContent.trim()
                    : "",

                order: index + 1
            };
        }
    );
}


/* =========================================================
   SAVE PORTFOLIO
   ========================================================= */

function savePortfolio() {

    const name =
        portfolioNameInput?.value.trim() ||
        "My Developer Portfolio";

    const headline =
        headlineInput?.value.trim() ||
        "";

    const description =
        descriptionInput?.value.trim() ||
        "";

    const sections =
        getSectionsData();

    const currentTime =
        new Date().toISOString();

    const portfolio = {

        id:
            "portfolio_" +
            Date.now(),

        name:
            name,

        headline:
            headline,

        description:
            description,

        sections:
            sections,

        createdAt:
            currentTime,

        updatedAt:
            currentTime
    };


    /* Get existing portfolios */

    let portfolios = [];

    try {

        portfolios =
            JSON.parse(
                localStorage.getItem(
                    "my_portfolios"
                )
            ) || [];

    } catch (error) {

        portfolios = [];
    }


    /* Add new portfolio */

    portfolios.push(portfolio);


    /* Save portfolios */

    localStorage.setItem(
        "my_portfolios",
        JSON.stringify(portfolios)
    );


    /* Save current portfolio */

    localStorage.setItem(
        "current_portfolio",
        JSON.stringify(portfolio)
    );


    /* Update name */

    if (savedName) {

        savedName.textContent =
            name;
    }


    /* Refresh cards */

    renderPortfolioCards();


    showMessage(
        "✓ Portfolio saved successfully"
    );
}


/* =========================================================
   LOAD CURRENT PORTFOLIO
   ========================================================= */

function loadCurrentPortfolio() {

    const saved =
        localStorage.getItem(
            "current_portfolio"
        );

    if (!saved) {
        return;
    }

    try {

        const portfolio =
            JSON.parse(saved);

        if (!portfolio) {
            return;
        }


        /* Portfolio name */

        if (portfolioNameInput) {

            portfolioNameInput.value =
                portfolio.name || "";
        }

        if (savedName) {

            savedName.textContent =
                portfolio.name ||
                "My Developer Portfolio";
        }


        /* Headline */

        if (headlineInput) {

            headlineInput.value =
                portfolio.headline || "";
        }


        /* Description */

        if (descriptionInput) {

            descriptionInput.value =
                portfolio.description || "";
        }


        /* Update preview */

        updateHeadlinePreview();

        updateDescriptionPreview();


    } catch (error) {

        console.error(
            "Portfolio loading error:",
            error
        );
    }
}


/* =========================================================
   GET ALL PORTFOLIOS
   ========================================================= */

function getPortfolios() {

    try {

        const data =
            JSON.parse(
                localStorage.getItem(
                    "my_portfolios"
                )
            );

        return Array.isArray(data)
            ? data
            : [];

    } catch (error) {

        console.error(
            "Portfolio data error:",
            error
        );

        return [];
    }
}


/* =========================================================
   RENDER PORTFOLIO CARDS
   ========================================================= */

function renderPortfolioCards() {

    const container =
        document.querySelector(
            ".portfolio-cards"
        );

    if (!container) {
        return;
    }

    const portfolios =
        getPortfolios();


    /* Find create-new card */

    const newCard =
        container.querySelector(
            ".new-portfolio"
        );


    /* Remove old cards */

    container
        .querySelectorAll(
            ".portfolio-card"
        )
        .forEach(function (card) {

            card.remove();
        });


    /* Create cards */

    portfolios.forEach(
        function (portfolio) {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "portfolio-card";


            const date =
                portfolio.updatedAt
                    ? new Date(
                        portfolio.updatedAt
                    ).toLocaleDateString()
                    : "Recently";


            card.innerHTML = `

                <div class="portfolio-cover">

                    <span>RM.</span>

                    <strong>
                        Creative
                        <br>
                        Developer.
                    </strong>

                </div>


                <div class="card-info">

                    <div>

                        <b>
                            ${escapeHTML(
                                portfolio.name
                            )}
                        </b>

                        <small>
                            Updated ${escapeHTML(date)}
                        </small>

                    </div>


                    <button
                        type="button"
                        class="portfolio-menu-button"
                    >
                        ⋮
                    </button>

                </div>


                <div class="card-actions">

                    <button
                        type="button"
                        class="view-button"
                    >
                        👁 View
                    </button>

                    <button
                        type="button"
                        class="edit-button"
                    >
                        ✎ Edit
                    </button>

                    <button
                        type="button"
                        class="delete-button"
                    >
                        🗑 Delete
                    </button>

                </div>
            `;


            /* Menu */

            const menuButton =
                card.querySelector(
                    ".portfolio-menu-button"
                );

            if (menuButton) {

                menuButton.addEventListener(
                    "click",
                    function () {

                        openPortfolioMenu(
                            portfolio.id
                        );
                    }
                );
            }


            /* View */

            const viewButton =
                card.querySelector(
                    ".view-button"
                );

            if (viewButton) {

                viewButton.addEventListener(
                    "click",
                    function () {

                        viewPortfolio(
                            portfolio.id
                        );
                    }
                );
            }


            /* Edit */

            const editButton =
                card.querySelector(
                    ".edit-button"
                );

            if (editButton) {

                editButton.addEventListener(
                    "click",
                    function () {

                        editPortfolio(
                            portfolio.id
                        );
                    }
                );
            }


            /* Delete */

            const deleteButton =
                card.querySelector(
                    ".delete-button"
                );

            if (deleteButton) {

                deleteButton.addEventListener(
                    "click",
                    function () {

                        deletePortfolio(
                            portfolio.id
                        );
                    }
                );
            }


            /* Insert card */

            if (newCard) {

                container.insertBefore(
                    card,
                    newCard
                );

            } else {

                container.appendChild(
                    card
                );
            }

        }
    );
}


/* =========================================================
   EDIT PORTFOLIO
   ========================================================= */

function editPortfolio(id) {

    const portfolios =
        getPortfolios();

    const portfolio =
        portfolios.find(
            function (item) {
                return item.id === id;
            }
        );

    if (!portfolio) {

        showMessage(
            "Portfolio not found"
        );

        return;
    }


    /* Save as current */

    localStorage.setItem(
        "current_portfolio",
        JSON.stringify(portfolio)
    );


    /* Load */

    loadCurrentPortfolio();


    /* Scroll */

    const builder =
        document.querySelector(
            ".builder"
        );

    if (builder) {

        builder.scrollIntoView({
            behavior: "smooth"
        });
    }


    showMessage(
        "✎ Portfolio loaded for editing"
    );
}


/* =========================================================
   VIEW PORTFOLIO
   ========================================================= */

function viewPortfolio(id) {

    const portfolios =
        getPortfolios();

    const portfolio =
        portfolios.find(
            function (item) {
                return item.id === id;
            }
        );

    if (!portfolio) {

        showMessage(
            "Portfolio not found"
        );

        return;
    }


    const preview =
        window.open(
            "",
            "_blank"
        );

    if (!preview) {

        showMessage(
            "Please allow pop-ups in your browser"
        );

        return;
    }


    const sectionHTML =
        (portfolio.sections || [])
            .map(
                function (section) {

                    return `
                        <span class="tag">
                            ${escapeHTML(
                                section.name
                            )}
                        </span>
                    `;
                }
            )
            .join("");


    const title =
        portfolio.headline ||
        portfolio.name ||
        "Creative Developer";


    const description =
        portfolio.description ||
        "Welcome to my portfolio.";


    preview.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <meta charset="UTF-8">

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >

            <title>
                ${escapeHTML(
                    portfolio.name
                )}
            </title>

            <style>

                * {
                    box-sizing: border-box;
                }

                body {

                    margin: 0;

                    background: #09090b;

                    color: white;

                    font-family:
                        Arial,
                        sans-serif;
                }

                .hero {

                    min-height: 100vh;

                    padding:
                        80px 10%;

                    display: flex;

                    flex-direction:
                        column;

                    justify-content:
                        center;

                    background:
                        radial-gradient(
                            circle at 80% 20%,
                            #4c1d95,
                            transparent 30%
                        ),
                        #09090b;
                }

                .label {

                    color: #a78bfa;

                    letter-spacing: 3px;

                    font-size: 12px;
                }

                h1 {

                    font-size:
                        clamp(
                            50px,
                            9vw,
                            110px
                        );

                    line-height: .9;

                    margin:
                        25px 0;
                }

                p {

                    max-width:
                        600px;

                    color: #a1a1aa;

                    font-size: 18px;

                    line-height: 1.6;
                }

                .sections {

                    margin-top: 50px;

                    display: flex;

                    flex-wrap: wrap;

                    gap: 10px;
                }

                .tag {

                    border:
                        1px solid #27272a;

                    padding:
                        10px 15px;

                    border-radius:
                        50px;

                    color:
                        #d4d4d8;
                }

            </style>

        </head>


        <body>

            <section class="hero">

                <span class="label">
                    PORTFOLIO
                </span>

                <h1>
                    ${escapeHTML(title)}
                </h1>

                <p>
                    ${escapeHTML(description)}
                </p>

                <div class="sections">

                    ${sectionHTML}

                </div>

            </section>

        </body>

        </html>
    `);

    preview.document.close();
}


/* =========================================================
   DELETE PORTFOLIO
   ========================================================= */

function deletePortfolio(id) {

    let portfolios =
        getPortfolios();


    /* If no ID supplied */

    if (!id) {

        if (portfolios.length === 0) {

            showMessage(
                "No portfolio to delete"
            );

            return;
        }

        id =
            portfolios[0].id;
    }


    const portfolio =
        portfolios.find(
            function (item) {
                return item.id === id;
            }
        );


    if (!portfolio) {
        return;
    }


    const confirmed =
        window.confirm(
            `Delete "${portfolio.name}"?`
        );


    if (!confirmed) {
        return;
    }


    portfolios =
        portfolios.filter(
            function (item) {
                return item.id !== id;
            }
        );


    localStorage.setItem(
        "my_portfolios",
        JSON.stringify(portfolios)
    );


    /* Remove current portfolio */

    try {

        const current =
            JSON.parse(
                localStorage.getItem(
                    "current_portfolio"
                )
            );

        if (
            current &&
            current.id === id
        ) {

            localStorage.removeItem(
                "current_portfolio"
            );
        }

    } catch (error) {

        console.error(
            "Could not clear current portfolio:",
            error
        );
    }


    renderPortfolioCards();


    showMessage(
        "🗑 Portfolio deleted"
    );
}


/* =========================================================
   PORTFOLIO MENU
   ========================================================= */

function openPortfolioMenu(id) {

    const choice =
        window.prompt(
            "Choose an option:\n\n" +
            "1 = Edit\n" +
            "2 = View\n" +
            "3 = Delete"
        );


    switch (choice) {

        case "1":

            editPortfolio(id);

            break;


        case "2":

            viewPortfolio(id);

            break;


        case "3":

            deletePortfolio(id);

            break;


        default:

            break;
    }
}


/* =========================================================
   START BUILDING
   ========================================================= */

function startBuilding() {

    const builder =
        document.querySelector(
            ".builder"
        );


    if (builder) {

        builder.scrollIntoView({
            behavior: "smooth"
        });
    }


    setTimeout(
        function () {

            if (portfolioNameInput) {

                portfolioNameInput.focus();
            }

        },
        700
    );
}


/* =========================================================
   ADD CUSTOM SECTION
   ========================================================= */

function setupAddSectionButton() {

    const addSectionButton =
        document.querySelector(
            ".add-section"
        );


    if (!addSectionButton) {
        return;
    }


    addSectionButton.addEventListener(
        "click",
        function () {

            if (!sectionsContainer) {
                return;
            }


            const name =
                window.prompt(
                    "Enter section name:"
                );


            if (!name || !name.trim()) {
                return;
            }


            const section =
                document.createElement(
                    "div"
                );


            section.className =
                "section";


            section.draggable =
                true;


            section.innerHTML = `

                <span class="drag">
                    ☷
                </span>

                <span class="section-icon">
                    ◆
                </span>

                <div>

                    <b>
                        ${escapeHTML(
                            name.trim()
                        )}
                    </b>

                    <small>
                        Custom portfolio section
                    </small>

                </div>
            `;


            sectionsContainer.appendChild(
                section
            );


            /* Add click */

            addSectionClickEvent(
                section
            );


            /* Enable drag */

            enableDragAndDrop();


            /* Save */

            saveSections();


            showMessage(
                "＋ Section added"
            );
        }
    );
}


/* =========================================================
   AI ASSISTANT
   ========================================================= */

function setupAIButtons() {

    const aiButtons =
        document.querySelectorAll(
            ".ai-btn, .ai-tip button"
        );


    aiButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const generatedText =
                        "I am a passionate developer who enjoys creating modern, user-friendly and innovative digital experiences using today's web technologies.";


                    if (descriptionInput) {

                        descriptionInput.value =
                            generatedText;

                        updateDescriptionPreview();
                    }


                    showMessage(
                        "✨ AI generated professional content"
                    );
                }
            );
        }
    );
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================================================
   TOAST MESSAGE
   ========================================================= */

function showMessage(message) {

    let toast =
        document.querySelector(
            ".toast-message"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.className =
            "toast-message";


        toast.style.position =
            "fixed";

        toast.style.bottom =
            "25px";

        toast.style.right =
            "25px";

        toast.style.padding =
            "13px 18px";

        toast.style.borderRadius =
            "10px";

        toast.style.background =
            "#18181b";

        toast.style.border =
            "1px solid #3f3f46";

        toast.style.color =
            "#ffffff";

        toast.style.fontSize =
            "12px";

        toast.style.zIndex =
            "9999";

        toast.style.boxShadow =
            "0 10px 30px rgba(0,0,0,.4)";

        toast.style.transition =
            "opacity .3s ease";


        document.body.appendChild(
            toast
        );
    }


    toast.textContent =
        message;


    toast.style.opacity =
        "1";


    clearTimeout(
        toast.hideTimer
    );


    toast.hideTimer =
        setTimeout(
            function () {

                toast.style.opacity =
                    "0";

            },
            2500
        );
}


/* =========================================================
   SETUP LIVE EVENTS
   ========================================================= */

function setupLiveEvents() {

    if (headlineInput) {

        headlineInput.addEventListener(
            "input",
            updateHeadlinePreview
        );
    }


    if (descriptionInput) {

        descriptionInput.addEventListener(
            "input",
            updateDescriptionPreview
        );
    }


    if (portfolioNameInput) {

        portfolioNameInput.addEventListener(
            "input",
            updatePortfolioName
        );
    }
}


/* =========================================================
   INITIALIZE APPLICATION
   ========================================================= */

function initApp() {

    console.log(
        "Portfolio Studio starting..."
    );


    /* Find HTML elements */

    initializeElements();


    /* Setup events */

    setupLiveEvents();

    setupAddSectionButton();

    setupAIButtons();


    /* Existing sections */

    const sections =
        document.querySelectorAll(
            ".section"
        );


    sections.forEach(
        function (section) {

            addSectionClickEvent(
                section
            );
        }
    );


    /* Drag & Drop */

    enableDragAndDrop();


    /* Load saved data */

    loadSections();

    loadCurrentPortfolio();

    renderPortfolioCards();


    /* Update preview */

    updateHeadlinePreview();

    updateDescriptionPreview();

    updatePortfolioName();


    console.log(
        "✓ Portfolio Studio loaded successfully"
    );
}


/* =========================================================
   START APPLICATION
   ========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initApp
    )

} 
else {

    initApp()
}
