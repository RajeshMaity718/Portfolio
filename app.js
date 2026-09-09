// ============================================================
// PORTFOLIO STUDIO - MAIN APP.JS
// Node.js + Express + MySQL
// ============================================================

const API_URL = "http://localhost:3000/api/portfolio";

// ============================================================
// GLOBAL VARIABLES
// ============================================================

let appState = null;

// ============================================================
// PHOTO LIBRARY
// ============================================================

let photoLibrary = [];

let photoLibraryLoaded = false;

let draggedPhotoUrl = null;

let renderDebounceTimer = null;
let backendSaveTimer = null;

let backendSaveInProgress = false;
let backendSavePending = false;

let appInitialized = false;


// ============================================================
// DOM ELEMENTS
// ============================================================

const elements = {
    previewFrame: document.getElementById("preview-frame"),
    saveStatusIndicator: document.getElementById("save-status"),
    deployModal: document.getElementById("deploy-modal"),
    closeDeployModalBtn: document.getElementById("close-deploy-modal"),

    projectsList: document.getElementById("projects-list"),
    experienceList: document.getElementById("experience-list"),
    educationList: document.getElementById("education-list"),
    skillsList: document.getElementById("skills-list"),
    customSectionsList: document.getElementById("custom-sections-list")
};


// ============================================================
// INITIALIZE APPLICATION
// ============================================================

async function initApp() {

    console.log("🚀 Starting Portfolio Studio...");
        initializePhotoLibrary();

    // Load local data first
    loadSavedState();

    // Make sure structure exists
    ensureAppStateStructure();

    // Bind buttons and inputs
    bindGlobalEvents();

    // Display local data
    populateFormFromState();

    // Render preview
    renderPreview();

    /*
     * IMPORTANT:
     * We do NOT automatically create a new MySQL row
     * when the application starts.
     *
     * This prevents empty/duplicate PORT rows.
     */

    // If we already have a portfolio ID,
    // load the latest version from MySQL.
    if (appState.portfolio_id) {

        console.log(
            "🔄 Loading portfolio from MySQL:",
            appState.portfolio_id
        );

        await loadPortfolioFromBackend(
            appState.portfolio_id,
            true
        );
    }

    appInitialized = true;

    setSaveStatus("Ready");

    showToast(
        "Portfolio Studio Ready!",
        "info"
    );

    console.log("✅ Application initialized");
}


// ============================================================
// ENSURE APP STATE STRUCTURE
// ============================================================

function ensureAppStateStructure() {

    if (!appState || typeof appState !== "object") {
        appState = {};
    }

    if (!appState.personal || typeof appState.personal !== "object") {
        appState.personal = {};
    }

    if (
        !appState.personal.social ||
        typeof appState.personal.social !== "object"
    ) {
        appState.personal.social = {};
    }

    if (!appState.about || typeof appState.about !== "object") {
        appState.about = {};
    }

    if (!appState.theme || typeof appState.theme !== "object") {
        appState.theme = {};
    }

    if (!Array.isArray(appState.skills)) {
        appState.skills = [];
    }

    if (!Array.isArray(appState.projects)) {
        appState.projects = [];
    }

    if (!Array.isArray(appState.experience)) {
        appState.experience = [];
    }

    if (!Array.isArray(appState.education)) {
        appState.education = [];
    }

    if (!Array.isArray(appState.customSections)) {
        appState.customSections = [];
    }

    // Defaults

    if (!appState.theme.template) {
        appState.theme.template = "modern-tech";
    }

    if (!appState.theme.fontFamily) {
        appState.theme.fontFamily = "Plus Jakarta Sans";
    }

    if (!appState.theme.primaryColor) {
        appState.theme.primaryColor = "#6366f1";
    }

    if (!appState.theme.mode) {
        appState.theme.mode = "dark";
    }

    if (appState.personal.availableForHire === undefined) {
        appState.personal.availableForHire = true;
    }
}


// ============================================================
// LOAD LOCAL STORAGE
// ============================================================

function loadSavedState() {

    try {

        const saved =
            localStorage.getItem(
                "portfolio_studio_state"
            );

        if (saved) {

            appState = JSON.parse(saved);

            console.log(
                "✅ Portfolio loaded from localStorage"
            );

        } else {

            // First-time application
            if (
                typeof SAMPLE_PORTFOLIOS !== "undefined" &&
                SAMPLE_PORTFOLIOS.fullstack
            ) {

                appState =
                    JSON.parse(
                        JSON.stringify(
                            SAMPLE_PORTFOLIOS.fullstack
                        )
                    );

            } else {

                appState = createEmptyPortfolio();
            }

            console.log(
                "🆕 New portfolio state created"
            );
        }

    } catch (error) {

        console.error(
            "❌ LocalStorage load error:",
            error
        );

        appState = createEmptyPortfolio();
    }

    ensureAppStateStructure();
}


// ============================================================
// EMPTY PORTFOLIO
// ============================================================

function createEmptyPortfolio() {

    return {

        personal: {

            name: "",
            title: "",
            bio: "",
            email: "",
            phone: "",
            location: "",
            avatar: "",
            availableForHire: true,
            statusText: "",
            ctaText: "",

            social: {

                github: "",
                linkedin: "",
                twitter: "",
                website: ""
            }
        },

        about: {

            heading: "",
            summary: "",
            highlights: []
        },

        theme: {

            template: "modern-tech",
            fontFamily: "Plus Jakarta Sans",
            primaryColor: "#6366f1",
            mode: "dark"
        },

        skills: [],
        projects: [],
        experience: [],
        education: [],
        customSections: []
    };
}


// ============================================================
// SAVE LOCAL STATE
// ============================================================

function saveState() {

    try {

        localStorage.setItem(
            "portfolio_studio_state",
            JSON.stringify(appState)
        );

    } catch (error) {

        console.error(
            "❌ LocalStorage save failed:",
            error
        );
    }
}


// ============================================================
// SAVE STATUS
// ============================================================

function setSaveStatus(status) {

    if (!elements.saveStatusIndicator) {
        return;
    }

    elements.saveStatusIndicator.innerText =
        status;

    elements.saveStatusIndicator.classList.remove(
        "text-amber-400",
        "text-emerald-400",
        "text-red-400"
    );

    if (
        status === "Saved" ||
        status === "Saved to MySQL"
    ) {

        elements.saveStatusIndicator.classList.add(
            "text-emerald-400"
        );

    } else if (
        status === "MySQL Error"
    ) {

        elements.saveStatusIndicator.classList.add(
            "text-red-400"
        );

    } else {

        elements.saveStatusIndicator.classList.add(
            "text-amber-400"
        );
    }
}


// ============================================================
// UPDATE LIVE PREVIEW
// ============================================================

function updateLivePreview(
    saveToBackend = true
) {

    setSaveStatus("Syncing...");

    clearTimeout(
        renderDebounceTimer
    );

    renderDebounceTimer =
        setTimeout(
            () => {

                saveState();

                renderPreview();

                /*
                 * Only save to MySQL when an actual
                 * user change happened.
                 */
                if (
                    saveToBackend &&
                    appInitialized
                ) {

                    scheduleBackendSave();
                }

            },
            300
        );
}


// ============================================================
// RENDER PREVIEW
// ============================================================

function renderPreview() {

    try {

        if (
            typeof PortfolioTemplates === "undefined"
        ) {

            console.error(
                "❌ PortfolioTemplates is not loaded."
            );

            return;
        }

        const renderedHTML =
            PortfolioTemplates.render(
                appState
            );

        if (!elements.previewFrame) {
            return;
        }

        const doc =
            elements.previewFrame.contentDocument ||
            elements.previewFrame.contentWindow.document;

        doc.open();

        doc.write(
            renderedHTML
        );

        doc.close();

    } catch (error) {

        console.error(
            "❌ Preview render failed:",
            error
        );
    }
}


// ============================================================
// SCHEDULE BACKEND SAVE
// ============================================================

function scheduleBackendSave() {

    clearTimeout(
        backendSaveTimer
    );

    backendSaveTimer =
        setTimeout(
            () => {

                savePortfolioToBackend();

            },
            800
        );
}


// ============================================================
// CREATE BACKEND PAYLOAD
// ============================================================

function createBackendPayload() {

    return {

        // -------------------------------
        // PERSONAL
        // -------------------------------

        name:
            appState.personal?.name || "",

        title:
            appState.personal?.title || "",

        bio:
            appState.personal?.bio || "",

        email:
            appState.personal?.email || "",

        phone:
            appState.personal?.phone || "",

        location:
            appState.personal?.location || "",

        avatar:
            appState.personal?.avatar || "",

        available_for_hire:
            appState.personal?.availableForHire
                ? 1
                : 0,

        status_text:
            appState.personal?.statusText || "",

        cta_text:
            appState.personal?.ctaText || "",


        // -------------------------------
        // SOCIAL
        // -------------------------------

        social:
            appState.personal?.social || {},


        // -------------------------------
        // SKILLS
        // -------------------------------

        skills:
            Array.isArray(appState.skills)
                ? appState.skills
                : [],


        // -------------------------------
        // PROJECTS
        // -------------------------------

        projects:
            Array.isArray(appState.projects)
                ? appState.projects
                : [],


        // -------------------------------
        // EXPERIENCE
        // -------------------------------

        experience:
            Array.isArray(appState.experience)
                ? appState.experience
                : [],


        // -------------------------------
        // EDUCATION
        // -------------------------------

        education:
            Array.isArray(appState.education)
                ? appState.education
                : [],


        // -------------------------------
        // OTHER DATA
        // -------------------------------

        custom_data: {

            about:
                appState.about || {},

            theme:
                appState.theme || {},

            customSections:
                Array.isArray(
                    appState.customSections
                )
                    ? appState.customSections
                    : []
        }
    };
}


// ============================================================
// SAVE PORTFOLIO TO MYSQL
// ============================================================

async function savePortfolioToBackend() {

    if (!appState) {
        return;
    }

    /*
     * If another save is already running,
     * don't start another POST.
     *
     * Instead mark the save as pending.
     */
    if (backendSaveInProgress) {

        backendSavePending = true;

        console.log(
            "⏳ Save already running. Latest changes will be saved afterward."
        );

        return;
    }

    backendSaveInProgress = true;
    backendSavePending = false;

    try {

        const payload =
            createBackendPayload();

        let response;

        let isNewPortfolio =
            !appState.portfolio_id;


        // ====================================================
        // CREATE
        // ====================================================

        if (isNewPortfolio) {

            console.log(
                "🆕 Creating ONE new portfolio..."
            );

            response =
                await fetch(
                    API_URL,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                payload
                            )
                    }
                );

        }


        // ====================================================
        // UPDATE
        // ====================================================

        else {

            console.log(
                "🔄 Updating existing portfolio:",
                appState.portfolio_id
            );

            response =
                await fetch(
                    `${API_URL}/${encodeURIComponent(
                        appState.portfolio_id
                    )}`,
                    {

                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                payload
                            )
                    }
                );
        }


        // ====================================================
        // RESPONSE
        // ====================================================

        const data =
            await response.json();

        console.log(
            "📦 Backend response:",
            data
        );


        // ====================================================
        // ERROR
        // ====================================================

        if (!response.ok) {

            throw new Error(
                data.error ||
                data.message ||
                "Database operation failed"
            );
        }


        // ====================================================
        // IMPORTANT:
        // SAVE MYSQL PORTFOLIO ID
        // ====================================================

        if (
            data.portfolio_id &&
            !appState.portfolio_id
        ) {

            appState.portfolio_id =
                data.portfolio_id;

            saveState();

            console.log(
                "🔐 Portfolio ID stored:",
                appState.portfolio_id
            );
        }


        // ====================================================
        // SUCCESS
        // ====================================================

        setSaveStatus(
            "Saved to MySQL"
        );

        console.log(
            "✅ Portfolio saved successfully"
        );


        /*
         * Only show this message when useful.
         * This prevents too many popup messages
         * while typing.
         */
        if (isNewPortfolio) {

            showToast(
                "Portfolio created and saved to MySQL!",
                "success"
            );
        }

    } catch (error) {

        console.error(
            "❌ MySQL save failed:",
            error
        );

        setSaveStatus(
            "MySQL Error"
        );

        showToast(
            "MySQL save failed!",
            "warning"
        );

    } finally {

        backendSaveInProgress =
            false;


        /*
         * If user changed something
         * while previous request was running,
         * save the latest state.
         */
        if (backendSavePending) {

            backendSavePending =
                false;

            scheduleBackendSave();
        }
    }
}


// ============================================================
// CONVERT MYSQL DATA → FRONTEND APP STATE
// ============================================================

function convertBackendPortfolioToAppState(
    portfolio
) {

    if (!portfolio) {
        return null;
    }

    let customData =
        parseJSONValue(
            portfolio.custom_data,
            {}
        );

    let social =
        parseJSONValue(
            portfolio.social,
            {}
        );

    let skills =
        parseJSONValue(
            portfolio.skills,
            []
        );

    let projects =
        parseJSONValue(
            portfolio.projects,
            []
        );

    let experience =
        parseJSONValue(
            portfolio.experience,
            []
        );

    let education =
        parseJSONValue(
            portfolio.education,
            []
        );


    return {

        portfolio_id:
            portfolio.portfolio_id || "",


        personal: {

            name:
                portfolio.name || "",

            title:
                portfolio.title || "",

            bio:
                portfolio.bio || "",

            email:
                portfolio.email || "",

            phone:
                portfolio.phone || "",

            location:
                portfolio.location || "",

            avatar:
                portfolio.avatar || "",

            availableForHire:
                Number(
                    portfolio.available_for_hire
                ) === 1,

            statusText:
                portfolio.status_text || "",

            ctaText:
                portfolio.cta_text || "",

            social:
                social || {}
        },


        skills:
            Array.isArray(skills)
                ? skills
                : [],


        projects:
            Array.isArray(projects)
                ? projects
                : [],


        experience:
            Array.isArray(experience)
                ? experience
                : [],


        education:
            Array.isArray(education)
                ? education
                : [],


        about:
            customData.about || {},


        theme:
            customData.theme || {},


        customSections:
            Array.isArray(
                customData.customSections
            )
                ? customData.customSections
                : []
    };
}


// ============================================================
// SAFE JSON PARSER
// ============================================================

function parseJSONValue(
    value,
    fallback
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return fallback;
    }

    if (
        typeof value === "object"
    ) {

        return value;
    }

    try {

        return JSON.parse(value);

    } catch (error) {

        console.warn(
            "⚠️ JSON parse failed:",
            value
        );

        return fallback;
    }
}


// ============================================================
// LOAD ONE PORTFOLIO FROM MYSQL
// ============================================================

async function loadPortfolioFromBackend(
    portfolioId,
    updateUI = true
) {

    try {

        const response =
            await fetch(
                `${API_URL}/${encodeURIComponent(
                    portfolioId
                )}`
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Portfolio not found"
            );
        }

        const loadedState =
            convertBackendPortfolioToAppState(
                data.portfolio
            );

        if (!loadedState) {

            throw new Error(
                "Invalid portfolio data received"
            );
        }

        appState =
            loadedState;

        ensureAppStateStructure();

        saveState();

        if (updateUI) {

            populateFormFromState();

            renderPreview();
        }

        console.log(
            "✅ Complete portfolio loaded from MySQL"
        );

        return appState;

    } catch (error) {

        console.error(
            "❌ Portfolio load failed:",
            error
        );

        /*
         * Don't destroy local data if MySQL
         * loading fails.
         */

        return null;
    }
}


// ============================================================
// LOAD ALL PORTFOLIOS
// ============================================================

async function loadPortfoliosFromBackend() {

    try {

        const response =
            await fetch(API_URL);

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load portfolios"
            );
        }

        console.log(
            "✅ Portfolios loaded:",
            data
        );

        return data.portfolios || [];

    } catch (error) {

        console.error(
            "❌ Failed to load portfolios:",
            error
        );

        return [];
    }
}


// ============================================================
// POPULATE FORM
// ============================================================

function populateFormFromState() {

    if (!appState) {
        return;
    }

    // ========================================================
    // PERSONAL
    // ========================================================

    setInputValue(
        "input-name",
        appState.personal.name
    );

    setInputValue(
        "input-title",
        appState.personal.title
    );

    setInputValue(
        "input-bio",
        appState.personal.bio
    );

    setInputValue(
        "input-email",
        appState.personal.email
    );

    setInputValue(
        "input-phone",
        appState.personal.phone
    );

    setInputValue(
        "input-location",
        appState.personal.location
    );

    setInputValue(
        "input-avatar-url",
        appState.personal.avatar
    );

    setInputValue(
        "input-status-text",
        appState.personal.statusText
    );

    setInputValue(
        "input-cta-text",
        appState.personal.ctaText
    );

    setCheckedValue(
        "input-available",
        appState.personal.availableForHire
    );


    // ========================================================
    // SOCIAL
    // ========================================================

    setInputValue(
        "input-social-github",
        appState.personal.social.github
    );

    setInputValue(
        "input-social-linkedin",
        appState.personal.social.linkedin
    );

    setInputValue(
        "input-social-twitter",
        appState.personal.social.twitter
    );

    setInputValue(
        "input-social-website",
        appState.personal.social.website
    );


    // ========================================================
    // ABOUT
    // ========================================================

    setInputValue(
        "input-about-heading",
        appState.about.heading
    );

    setInputValue(
        "input-about-summary",
        appState.about.summary
    );

    setInputValue(
        "input-about-highlights",
        (appState.about.highlights || []).join("\n")
    );


    // ========================================================
    // THEME
    // ========================================================

    setInputValue(
        "template-select",
        appState.theme.template
    );

    setInputValue(
        "font-select",
        appState.theme.fontFamily
    );

    setInputValue(
        "color-picker",
        appState.theme.primaryColor
    );

    updateThemeSwatches(
        appState.theme.primaryColor
    );

    updateModeButton(
        appState.theme.mode
    );


    // ========================================================
    // LISTS
    // ========================================================

    renderSkillsList();

    renderProjectsList();

    renderExperienceList();

    renderEducationList();

    renderCustomSectionsList();
}


// ============================================================
// SET INPUT
// ============================================================

function setInputValue(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {

        element.value =
            value ?? "";
    }
}


// ============================================================
// SET CHECKBOX
// ============================================================

function setCheckedValue(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {

        element.checked =
            Boolean(value);
    }
}


// ============================================================
// BIND GLOBAL EVENTS
// ============================================================

function bindGlobalEvents() {

    // ========================================================
    // TABS
    // ========================================================

    document
        .querySelectorAll(".tab-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const target =
                        button.getAttribute(
                            "data-tab"
                        );

                    document
                        .querySelectorAll(
                            ".tab-btn"
                        )
                        .forEach(btn => {

                            btn.classList.remove(
                                "active",
                                "bg-indigo-600",
                                "text-white"
                            );
                        });

                    document
                        .querySelectorAll(
                            ".tab-content"
                        )
                        .forEach(tab => {

                            tab.classList.add(
                                "hidden"
                            );
                        });

                    button.classList.add(
                        "active",
                        "bg-indigo-600",
                        "text-white"
                    );

                    const targetElement =
                        document.getElementById(
                            `tab-${target}`
                        );

                    if (targetElement) {

                        targetElement.classList.remove(
                            "hidden"
                        );
                    }
                }
            );
        });


    // ========================================================
    // PERSONAL INPUTS
    // ========================================================

    bindInputSync(
        "input-name",
        value =>
            appState.personal.name = value
    );

    bindInputSync(
        "input-title",
        value =>
            appState.personal.title = value
    );

    bindInputSync(
        "input-bio",
        value =>
            appState.personal.bio = value
    );

    bindInputSync(
        "input-email",
        value =>
            appState.personal.email = value
    );

    bindInputSync(
        "input-phone",
        value =>
            appState.personal.phone = value
    );

    bindInputSync(
        "input-location",
        value =>
            appState.personal.location = value
    );

    bindInputSync(
        "input-avatar-url",
        value =>
            appState.personal.avatar = value
    );

    bindInputSync(
        "input-status-text",
        value =>
            appState.personal.statusText = value
    );

    bindInputSync(
        "input-cta-text",
        value =>
            appState.personal.ctaText = value
    );


    // ========================================================
    // AVAILABLE FOR HIRE
    // ========================================================

    const available =
        document.getElementById(
            "input-available"
        );

    if (available) {

        available.addEventListener(
            "change",
            event => {

                appState.personal.availableForHire =
                    event.target.checked;

                updateLivePreview();
            }
        );
    }


    // ========================================================
    // AVATAR FILE
    // ========================================================

    const avatarFile =
        document.getElementById(
            "input-avatar-file"
        );

    if (avatarFile) {

        avatarFile.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files[0];

                if (!file) {
                    return;
                }

                const reader =
                    new FileReader();

                reader.onload =
                    event => {

                        appState.personal.avatar =
                            event.target.result;

                        setInputValue(
                            "input-avatar-url",
                            event.target.result
                        );

                        updateLivePreview();

                        showToast(
                            "Avatar image loaded!",
                            "success"
                        );
                    };

                reader.readAsDataURL(file);
            }
        );
    }


    // ========================================================
    // SOCIAL
    // ========================================================

    bindInputSync(
        "input-social-github",
        value =>
            appState.personal.social.github =
                value
    );

    bindInputSync(
        "input-social-linkedin",
        value =>
            appState.personal.social.linkedin =
                value
    );

    bindInputSync(
        "input-social-twitter",
        value =>
            appState.personal.social.twitter =
                value
    );

    bindInputSync(
        "input-social-website",
        value =>
            appState.personal.social.website =
                value
    );


    // ========================================================
    // ABOUT
    // ========================================================

    bindInputSync(
        "input-about-heading",
        value =>
            appState.about.heading = value
    );

    bindInputSync(
        "input-about-summary",
        value =>
            appState.about.summary = value
    );


    const highlights =
        document.getElementById(
            "input-about-highlights"
        );

    if (highlights) {

        highlights.addEventListener(
            "input",
            event => {

                appState.about.highlights =
                    event.target.value
                        .split("\n")
                        .map(line => line.trim())
                        .filter(Boolean);

                updateLivePreview();
            }
        );
    }


    // ========================================================
    // PRESET
    // ========================================================

    const preset =
        document.getElementById(
            "preset-select"
        );

    if (preset) {

        preset.addEventListener(
            "change",
            event => {

                const selected =
                    event.target.value;

                if (
                    typeof SAMPLE_PORTFOLIOS !== "undefined" &&
                    SAMPLE_PORTFOLIOS[selected]
                ) {

                    const confirmed =
                        confirm(
                            `Load the "${selected.toUpperCase()}" sample preset?`
                        );

                    if (!confirmed) {
                        return;
                    }

                    appState =
                        JSON.parse(
                            JSON.stringify(
                                SAMPLE_PORTFOLIOS[selected]
                            )
                        );

                    /*
                     * Important:
                     * A new preset should create a new
                     * portfolio, not overwrite the old one.
                     */
                    delete appState.portfolio_id;

                    ensureAppStateStructure();

                    populateFormFromState();

                    renderPreview();

                    saveState();

                    /*
                     * Do not immediately create database row.
                     * User's next change will save it.
                     */

                    setSaveStatus("Ready");

                    showToast(
                        `Loaded ${selected} preset!`,
                        "success"
                    );
                }
            }
        );
    }


    // ========================================================
    // TEMPLATE
    // ========================================================

    const template =
        document.getElementById(
            "template-select"
        );

    if (template) {

        template.addEventListener(
            "change",
            event => {

                appState.theme.template =
                    event.target.value;

                updateLivePreview();
            }
        );
    }


    // ========================================================
    // FONT
    // ========================================================

    const font =
        document.getElementById(
            "font-select"
        );

    if (font) {

        font.addEventListener(
            "change",
            event => {

                appState.theme.fontFamily =
                    event.target.value;

                updateLivePreview();
            }
        );
    }


    // ========================================================
    // COLOR SWATCHES
    // ========================================================

    document
        .querySelectorAll(
            ".color-swatch"
        )
        .forEach(swatch => {

            swatch.addEventListener(
                "click",
                () => {

                    const color =
                        swatch.getAttribute(
                            "data-color"
                        );

                    appState.theme.primaryColor =
                        color;

                    setInputValue(
                        "color-picker",
                        color
                    );

                    updateThemeSwatches(
                        color
                    );

                    updateLivePreview();
                }
            );
        });


    // ========================================================
    // COLOR PICKER
    // ========================================================

    const colorPicker =
        document.getElementById(
            "color-picker"
        );

    if (colorPicker) {

        colorPicker.addEventListener(
            "input",
            event => {

                appState.theme.primaryColor =
                    event.target.value;

                updateThemeSwatches(
                    event.target.value
                );

                updateLivePreview();
            }
        );
    }


    // ========================================================
    // DARK / LIGHT MODE
    // ========================================================

    const modeButton =
        document.getElementById(
            "theme-mode-toggle"
        );

    if (modeButton) {

        modeButton.addEventListener(
            "click",
            () => {

                appState.theme.mode =
                    appState.theme.mode === "light"
                        ? "dark"
                        : "light";

                updateModeButton(
                    appState.theme.mode
                );

                updateLivePreview();
            }
        );
    }


    // ========================================================
    // VIEWPORT
    // ========================================================

    document
        .querySelectorAll(
            ".viewport-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const mode =
                        button.getAttribute(
                            "data-viewport"
                        );

                    document
                        .querySelectorAll(
                            ".viewport-btn"
                        )
                        .forEach(btn => {

                            btn.classList.remove(
                                "bg-slate-700",
                                "text-white"
                            );
                        });

                    button.classList.add(
                        "bg-slate-700",
                        "text-white"
                    );

                    const container =
                        document.getElementById(
                            "preview-container"
                        );

                    if (container) {

                        container.className =
                            `preview-container mx-auto transition-all duration-300 viewport-${mode}`;
                    }
                }
            );
        });


    // ========================================================
    // DOWNLOAD HTML
    // ========================================================

    document
        .getElementById(
            "btn-download-html"
        )
        ?.addEventListener(
            "click",
            () => {

                if (
                    typeof PortfolioExporter ===
                    "undefined"
                ) {
                    return;
                }

                const result =
                    PortfolioExporter.downloadHTML(
                        appState
                    );

                if (result?.success) {

                    showToast(
                        `Downloaded ${result.fileName}!`,
                        "success"
                    );
                }
            }
        );


    // ========================================================
    // EXPORT JSON
    // ========================================================

    document
        .getElementById(
            "btn-export-json"
        )
        ?.addEventListener(
            "click",
            () => {

                if (
                    typeof PortfolioExporter ===
                    "undefined"
                ) {
                    return;
                }

                PortfolioExporter.downloadJSON(
                    appState
                );

                showToast(
                    "Portfolio backup exported!",
                    "success"
                );
            }
        );


    // ========================================================
    // IMPORT JSON
    // ========================================================

    document
        .getElementById(
            "input-import-json"
        )
        ?.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files[0];

                if (!file) {
                    return;
                }

                if (
                    typeof PortfolioExporter ===
                    "undefined"
                ) {
                    return;
                }

                PortfolioExporter.importJSON(
                    file,
                    (error, data) => {

                        if (
                            !error &&
                            data
                        ) {

                            appState =
                                data;

                            ensureAppStateStructure();

                            populateFormFromState();

                            saveState();

                            renderPreview();

                            /*
                             * If imported JSON already has
                             * portfolio_id, it updates that row.
                             *
                             * If not, next change creates one.
                             */

                            showToast(
                                "Portfolio data imported!",
                                "success"
                            );
                        }
                    }
                );
            }
        );


    // ========================================================
    // COPY HTML
    // ========================================================

    document
        .getElementById(
            "btn-copy-html"
        )
        ?.addEventListener(
            "click",
            async () => {

                if (
                    typeof PortfolioExporter ===
                    "undefined"
                ) {
                    return;
                }

                const success =
                    await PortfolioExporter
                        .copyHTMLToClipboard(
                            appState
                        );

                if (success) {

                    showToast(
                        "HTML copied!",
                        "success"
                    );
                }
            }
        );


    // ========================================================
    // PRINT PDF
    // ========================================================

    document
        .getElementById(
            "btn-print-pdf"
        )
        ?.addEventListener(
            "click",
            () => {

                if (
                    typeof PortfolioExporter ===
                    "undefined"
                ) {
                    return;
                }

                PortfolioExporter.printPreview(
                    elements.previewFrame
                );
            }
        );


    // ========================================================
    // DEPLOY GUIDE
    // ========================================================

    document
        .getElementById(
            "btn-deploy-guide"
        )
        ?.addEventListener(
            "click",
            () => {

                elements.deployModal
                    ?.classList
                    .add("open");
            }
        );


    document
        .getElementById(
            "close-deploy-modal"
        )
        ?.addEventListener(
            "click",
            () => {

                elements.deployModal
                    ?.classList
                    .remove("open");
            }
        );


    // ========================================================
    // ADD BUTTONS
    // ========================================================

    document
        .getElementById(
            "btn-add-skill"
        )
        ?.addEventListener(
            "click",
            addNewSkill
        );

    document
        .getElementById(
            "btn-add-project"
        )
        ?.addEventListener(
            "click",
            addNewProject
        );

    document
        .getElementById(
            "btn-add-experience"
        )
        ?.addEventListener(
            "click",
            addNewExperience
        );

    document
        .getElementById(
            "btn-add-education"
        )
        ?.addEventListener(
            "click",
            addNewEducation
        );

    document
        .getElementById(
            "btn-add-custom-section"
        )
        ?.addEventListener(
            "click",
            addNewCustomSection
        );
}


// ============================================================
// INPUT SYNC
// ============================================================

function bindInputSync(
    id,
    setter
) {

    const element =
        document.getElementById(id);

    if (!element) {
        return;
    }

    element.addEventListener(
        "input",
        event => {

            setter(
                event.target.value
            );

            updateLivePreview();
        }
    );
}


// ============================================================
// THEME SWATCHES
// ============================================================

function updateThemeSwatches(
    activeColor
) {

    document
        .querySelectorAll(
            ".color-swatch"
        )
        .forEach(swatch => {

            const color =
                swatch.getAttribute(
                    "data-color"
                );

            if (
                color &&
                activeColor &&
                color.toLowerCase() ===
                activeColor.toLowerCase()
            ) {

                swatch.classList.add(
                    "active"
                );

            } else {

                swatch.classList.remove(
                    "active"
                );
            }
        });
}


// ============================================================
// MODE BUTTON
// ============================================================

function updateModeButton(
    mode
) {

    const button =
        document.getElementById(
            "theme-mode-toggle"
        );

    if (!button) {
        return;
    }

    if (mode === "light") {

        button.innerHTML = `
            <i
                data-lucide="sun"
                class="w-4 h-4 text-amber-400">
            </i>
            Light Mode
        `;

    } else {

        button.innerHTML = `
            <i
                data-lucide="moon"
                class="w-4 h-4 text-indigo-400">
            </i>
            Dark Mode
        `;
    }

    if (window.lucide) {

        lucide.createIcons({
            root: button
        });
    }
}


// ============================================================
// SKILLS
// ============================================================

function renderSkillsList() {

    const container =
        document.getElementById(
            "skills-list"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    appState.skills.forEach(
        (skill, index) => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800";

            item.innerHTML = `
                <input
                    type="text"
                    value="${escapeAttribute(skill.name || "")}"
                    placeholder="Skill"
                    class="form-input text-xs py-1.5 flex-1"
                    data-index="${index}"
                    data-field="name"
                >

                <input
                    type="text"
                    value="${escapeAttribute(skill.category || "")}"
                    placeholder="Category"
                    class="form-input text-xs py-1.5 w-28"
                    data-index="${index}"
                    data-field="category"
                >

                <button
                    type="button"
                    class="p-1.5 text-slate-500 hover:text-red-400"
                    onclick="deleteSkill(${index})"
                >
                    <i
                        data-lucide="trash-2"
                        class="w-4 h-4">
                    </i>
                </button>
            `;

            item
                .querySelectorAll("input")
                .forEach(input => {

                    input.addEventListener(
                        "input",
                        event => {

                            const index =
                                Number(
                                    event.target
                                        .dataset
                                        .index
                                );

                            const field =
                                event.target
                                    .dataset
                                    .field;

                            appState.skills[index][field] =
                                event.target.value;

                            updateLivePreview();
                        }
                    );
                });

            container.appendChild(item);
        }
    );

    createIcons(container);
}


// ============================================================
// ADD SKILL
// ============================================================

function addNewSkill() {

    appState.skills.push({

        name: "New Skill",

        category: "General",

        level: "Proficient"
    });

    renderSkillsList();

    updateLivePreview();
}


// ============================================================
// DELETE SKILL
// ============================================================

window.deleteSkill =
    function(index) {

        appState.skills.splice(
            index,
            1
        );

        renderSkillsList();

        updateLivePreview();
    };


// ============================================================
// PROJECTS
// ============================================================

function renderProjectsList() {

    const container =
        document.getElementById(
            "projects-list"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    appState.projects.forEach(
        (project, index) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3";

            card.innerHTML = `
                <div class="flex items-center justify-between pb-2 border-b border-slate-800">

                    <span class="font-bold text-xs text-slate-200">
                        Project #${index + 1}
                    </span>

                    <button
                        type="button"
                        class="p-1 text-slate-400 hover:text-red-400"
                        onclick="deleteProject(${index})"
                    >
                        <i
                            data-lucide="trash-2"
                            class="w-4 h-4">
                        </i>
                    </button>

                </div>

                <div class="grid grid-cols-2 gap-2">

                    <input
                        type="text"
                        value="${escapeAttribute(project.title || "")}"
                        placeholder="Title"
                        class="form-input text-xs"
                        data-index="${index}"
                        data-field="title"
                    >

                    <input
                        type="text"
                        value="${escapeAttribute(project.subtitle || "")}"
                        placeholder="Subtitle"
                        class="form-input text-xs"
                        data-index="${index}"
                        data-field="subtitle"
                    >

                </div>

                <textarea
                    rows="2"
                    class="form-input text-xs"
                    placeholder="Description"
                    data-index="${index}"
                    data-field="description"
                >${escapeHTML(project.description || "")}</textarea>

                <div class="grid grid-cols-2 gap-2">

                    <input
                        type="text"
                        value="${escapeAttribute(project.demoUrl || "")}"
                        placeholder="Demo URL"
                        class="form-input text-xs"
                        data-index="${index}"
                        data-field="demoUrl"
                    >

                    <input
                        type="text"
                        value="${escapeAttribute(project.githubUrl || "")}"
                        placeholder="GitHub URL"
                        class="form-input text-xs"
                        data-index="${index}"
                        data-field="githubUrl"
                    >

                </div>
            `;

            card
                .querySelectorAll(
                    "input, textarea"
                )
                .forEach(input => {

                    input.addEventListener(
                        "input",
                        event => {

                            const index =
                                Number(
                                    event.target
                                        .dataset
                                        .index
                                );

                            const field =
                                event.target
                                    .dataset
                                    .field;

                            appState.projects[index][field] =
                                event.target.value;

                            updateLivePreview();
                        }
                    );
                });

            container.appendChild(card);
        }
    );

    createIcons(container);
}


// ============================================================
// ADD PROJECT
// ============================================================

function addNewProject() {

    appState.projects.push({

        id:
            "proj_" +
            Date.now(),

        title:
            "New Featured Project",

        subtitle:
            "Full-Stack App",

        description:
            "Describe your project here...",

        image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",

        tags:
            ["React", "Node.js"],

        demoUrl:
            "https://example.com",

        githubUrl:
            "https://github.com"
    });

    renderProjectsList();

    updateLivePreview();
}
// ============================================================
// PROJECTS
// ============================================================

function renderProjectsList() {

    const container =
        document.getElementById(
            "projects-list"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    appState.projects.forEach(
        (project, index) => {

            const card =
                document.createElement("div");

            card.className =
                "p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3";


            // ====================================================
            // PROJECT CARD
            // ====================================================

            card.innerHTML = `

                <div class="flex items-center justify-between pb-2 border-b border-slate-800">

                    <span class="font-bold text-xs text-slate-200">
                        Project #${index + 1}
                    </span>

                    <button
                        type="button"
                        class="p-1 text-slate-400 hover:text-red-400"
                        onclick="deleteProject(${index})"
                    >
                        <i
                            data-lucide="trash-2"
                            class="w-4 h-4">
                        </i>
                    </button>

                </div>


                <!-- PROJECT IMAGE DROP AREA -->

                <div>

                    <label class="form-label">
                        Project Photo
                    </label>

                    <div
                        class="project-image-drop mt-2 min-h-[140px] rounded-xl border-2 border-dashed border-slate-700 bg-slate-950 flex items-center justify-center overflow-hidden cursor-copy transition"
                        data-project-index="${index}"
                    >

                        ${
                            project.image
                            ?
                            `
                            <img
                                src="${escapeAttribute(project.image)}"
                                class="w-full h-40 object-cover"
                                alt="Project image"
                            >
                            `
                            :
                            `
                            <div class="text-center p-4">

                                <i
                                    data-lucide="image-plus"
                                    class="w-8 h-8 mx-auto text-slate-600 mb-2">
                                </i>

                                <p class="text-xs text-slate-500">
                                    Drag photo here
                                </p>

                            </div>
                            `
                        }

                    </div>

                </div>


                <!-- PROJECT TITLE -->

                <div class="grid grid-cols-2 gap-2">

                    <input
                        type="text"
                        value="${escapeAttribute(project.title || "")}"
                        placeholder="Title"
                        class="form-input text-xs"
                        data-index="${index}"
                        data-field="title"
                    >

                    <input
                        type="text"
                        value="${escapeAttribute(project.subtitle || "")}"
                        placeholder="Subtitle"
                        class="form-input text-xs"
                        data-index="${index}"
                        data-field="subtitle"
                    >

                </div>


                <!-- DESCRIPTION -->

                <textarea
                    rows="2"
                    class="form-input text-xs"
                    placeholder="Description"
                    data-index="${index}"
                    data-field="description"
                >${escapeHTML(project.description || "")}</textarea>


                <!-- URLS -->

                <div class="grid grid-cols-2 gap-2">

                    <input
                        type="text"
                        value="${escapeAttribute(project.demoUrl || "")}"
                        placeholder="Demo URL"
                        class="form-input text-xs"
                        data-index="${index}"
                        data-field="demoUrl"
                    >

                    <input
                        type="text"
                        value="${escapeAttribute(project.githubUrl || "")}"
                        placeholder="GitHub URL"
                        class="form-input text-xs"
                        data-index="${index}"
                        data-field="githubUrl"
                    >

                </div>

            `;


            // ====================================================
            // INPUT EVENTS
            // ====================================================

            card
                .querySelectorAll(
                    "input, textarea"
                )
                .forEach(input => {

                    input.addEventListener(
                        "input",
                        event => {

                            const projectIndex =
                                Number(
                                    event.target
                                        .dataset
                                        .index
                                );

                            const field =
                                event.target
                                    .dataset
                                    .field;

                            appState
                                .projects[
                                    projectIndex
                                ][field] =
                                    event.target.value;

                            updateLivePreview();

                        }
                    );

                });


            // ====================================================
            // DROP PHOTO
            // ====================================================

            const dropArea =
                card.querySelector(
                    ".project-image-drop"
                );

            if (dropArea) {

                dropArea.addEventListener(
                    "dragover",
                    event => {

                        event.preventDefault();

                        dropArea.classList.add(
                            "border-indigo-500",
                            "bg-indigo-500/10"
                        );

                    }
                );


                dropArea.addEventListener(
                    "dragleave",
                    () => {

                        dropArea.classList.remove(
                            "border-indigo-500",
                            "bg-indigo-500/10"
                        );

                    }
                );


                dropArea.addEventListener(
                    "drop",
                    event => {

                        event.preventDefault();

                        dropArea.classList.remove(
                            "border-indigo-500",
                            "bg-indigo-500/10"
                        );


                        // Get dragged photo

                        const photoUrl =
                            draggedPhotoUrl;


                        if (!photoUrl) {

                            showToast(
                                "Please drag a photo from the Photo Library.",
                                "warning"
                            );

                            return;
                        }


                        // Save photo into project

                        appState
                            .projects[index]
                            .image =
                                photoUrl;


                        // Save locally

                        saveState();


                        // Re-render project

                        renderProjectsList();


                        // Update portfolio preview

                        updateLivePreview();


                        showToast(
                            "Photo added to project!",
                            "success"
                        );


                        // Clear dragged photo

                        draggedPhotoUrl =
                            null;

                    }
                );

            }


            container.appendChild(card);

        }
    );


    createIcons(container);
}


// ============================================================
// DELETE PROJECT
// ============================================================

window.deleteProject =
    function(index) {

        appState.projects.splice(
            index,
            1
        );

        renderProjectsList();

        updateLivePreview();
    };


// ============================================================
// EXPERIENCE
// ============================================================

function renderExperienceList() {

    const container =
        document.getElementById(
            "experience-list"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    appState.experience.forEach(
        (experience, index) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2";

            card.innerHTML = `
                <div class="flex items-center justify-between pb-2 border-b border-slate-800">

                    <span class="font-bold text-xs text-slate-200">
                        Role #${index + 1}
                    </span>

                    <button
                        type="button"
                        class="p-1 text-slate-400 hover:text-red-400"
                        onclick="deleteExperience(${index})"
                    >
                        <i
                            data-lucide="trash-2"
                            class="w-4 h-4">
                        </i>
                    </button>

                </div>

                <div class="grid grid-cols-2 gap-2">

                    <input
                        type="text"
                        value="${escapeAttribute(experience.role || "")}"
                        placeholder="Job Title"
                        class="form-input text-xs"
                        data-index="${index}"
                        data-field="role"
                    >

                    <input
                        type="text"
                        value="${escapeAttribute(experience.company || "")}"
                        placeholder="Company"
                        class="form-input text-xs"
                        data-index="${index}"
                        data-field="company"
                    >

                </div>

                <input
                    type="text"
                    value="${escapeAttribute(experience.period || "")}"
                    placeholder="Period"
                    class="form-input text-xs"
                    data-index="${index}"
                    data-field="period"
                >

                <textarea
                    rows="2"
                    class="form-input text-xs"
                    placeholder="Description"
                    data-index="${index}"
                    data-field="description"
                >${escapeHTML(experience.description || "")}</textarea>
            `;

            card
                .querySelectorAll(
                    "input, textarea"
                )
                .forEach(input => {

                    input.addEventListener(
                        "input",
                        event => {

                            const index =
                                Number(
                                    event.target
                                        .dataset
                                        .index
                                );

                            const field =
                                event.target
                                    .dataset
                                    .field;

                            appState.experience[index][field] =
                                event.target.value;

                            updateLivePreview();
                        }
                    );
                });

            container.appendChild(card);
        }
    );

    createIcons(container);
}


// ============================================================
// ADD EXPERIENCE
// ============================================================

function addNewExperience() {

    appState.experience.push({

        id:
            "exp_" +
            Date.now(),

        role:
            "Software Engineer",

        company:
            "Tech Corp",

        period:
            "2023 - Present",

        description:
            "Built scalable web services and client platforms."
    });

    renderExperienceList();

    updateLivePreview();
}


// ============================================================
// DELETE EXPERIENCE
// ============================================================

window.deleteExperience =
    function(index) {

        appState.experience.splice(
            index,
            1
        );

        renderExperienceList();

        updateLivePreview();
    };


// ============================================================
// EDUCATION
// ============================================================

function renderEducationList() {

    const container =
        document.getElementById(
            "education-list"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    appState.education.forEach(
        (education, index) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2";

            card.innerHTML = `
                <div class="flex items-center justify-between pb-2 border-b border-slate-800">

                    <span class="font-bold text-xs text-slate-200">
                        Education #${index + 1}
                    </span>

                    <button
                        type="button"
                        class="p-1 text-slate-400 hover:text-red-400"
                        onclick="deleteEducation(${index})"
                    >
                        <i
                            data-lucide="trash-2"
                            class="w-4 h-4">
                        </i>
                    </button>

                </div>

                <div class="grid grid-cols-2 gap-2">

                    <input
                        type="text"
                        value="${escapeAttribute(education.degree || "")}"
                        placeholder="Degree"
                        class="form-input text-xs"
                        data-index="${index}"
                        data-field="degree"
                    >

                    <input
                        type="text"
                        value="${escapeAttribute(education.institution || "")}"
                        placeholder="University"
                        class="form-input text-xs"
                        data-index="${index}"
                        data-field="institution"
                    >

                </div>

                <input
                    type="text"
                    value="${escapeAttribute(education.period || "")}"
                    placeholder="Period"
                    class="form-input text-xs"
                    data-index="${index}"
                    data-field="period"
                >
            `;

            card
                .querySelectorAll("input")
                .forEach(input => {

                    input.addEventListener(
                        "input",
                        event => {

                            const index =
                                Number(
                                    event.target
                                        .dataset
                                        .index
                                );

                            const field =
                                event.target
                                    .dataset
                                    .field;

                            appState.education[index][field] =
                                event.target.value;

                            updateLivePreview();
                        }
                    );
                });

            container.appendChild(card);
        }
    );

    createIcons(container);
}


// ============================================================
// ADD EDUCATION
// ============================================================

function addNewEducation() {

    appState.education.push({

        id:
            "ed_" +
            Date.now(),

        degree:
            "B.S. in Computer Science",

        institution:
            "University",

        period:
            "2019 - 2023"
    });

    renderEducationList();

    updateLivePreview();
}


// ============================================================
// DELETE EDUCATION
// ============================================================

window.deleteEducation =
    function(index) {

        appState.education.splice(
            index,
            1
        );

        renderEducationList();

        updateLivePreview();
    };


// ============================================================
// CUSTOM SECTIONS
// ============================================================

function renderCustomSectionsList() {

    const container =
        document.getElementById(
            "custom-sections-list"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    appState.customSections.forEach(
        (section, index) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "p-4 rounded-xl bg-slate-900 border border-slate-800";

            card.innerHTML = `
                <div class="flex items-center justify-between">

                    <span class="font-bold text-sm text-slate-200">
                        ${escapeHTML(
                            section.title ||
                            "Custom Section"
                        )}
                    </span>

                    <button
                        type="button"
                        class="p-1 text-slate-400 hover:text-red-400"
                        onclick="deleteCustomSection(${index})"
                    >
                        <i
                            data-lucide="trash-2"
                            class="w-4 h-4">
                        </i>
                    </button>

                </div>
            `;

            container.appendChild(card);
        }
    );

    createIcons(container);
}


// ============================================================
// ADD CUSTOM SECTION
// ============================================================

function addNewCustomSection() {

    appState.customSections.push({

        id:
            "cs_" +
            Date.now(),

        title:
            "Certifications",

        items: [

            {
                title:
                    "AWS Certified",

                subtitle:
                    "2024"
            }
        ]
    });

    renderCustomSectionsList();

    updateLivePreview();
}


// ============================================================
// DELETE CUSTOM SECTION
// ============================================================

window.deleteCustomSection =
    function(index) {

        appState.customSections.splice(
            index,
            1
        );

        renderCustomSectionsList();

        updateLivePreview();
    };


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// ESCAPE ATTRIBUTE
// ============================================================

function escapeAttribute(value) {

    return escapeHTML(value);
}


// ============================================================
// CREATE LUCIDE ICONS
// ============================================================

function createIcons(
    root = document
) {

    if (
        window.lucide &&
        typeof lucide.createIcons === "function"
    ) {

        lucide.createIcons({
            root: root
        });
    }
}


// ============================================================
// TOAST
// ============================================================

function showToast(
    message,
    type = "success"
) {

    const container =
        document.getElementById(
            "toast-container"
        );

    if (!container) {
        return;
    }

    const toast =
        document.createElement(
            "div"
        );

    toast.className =
        `toast toast-${type}`;

    let icon =
        "check-circle";

    if (type === "info") {
        icon = "info";
    }

    if (type === "warning") {
        icon = "alert-triangle";
    }

    toast.innerHTML = `
        <i
            data-lucide="${icon}"
            class="w-5 h-5 text-inherit">
        </i>

        <span>
            ${escapeHTML(message)}
        </span>
    `;

    container.appendChild(
        toast
    );

    createIcons(toast);

    setTimeout(
        () => {
            toast.classList.add("show");
        },
        10
    );

    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

            setTimeout(
                () => {
                    toast.remove();
                },
                300
            );

        },
        3000
    );
}


// ============================================================
// START APPLICATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    initApp
);
// ============================================================
// PHOTO LIBRARY
// ============================================================

function loadPhotoLibrary() {

    try {

        const saved =
            localStorage.getItem(
                "portfolio_photo_library"
            );

        photoLibrary =
            saved
                ? JSON.parse(saved)
                : [];

    } catch (error) {

        console.error(
            "❌ Photo library load failed:",
            error
        );

        photoLibrary = [];
    }
}


// ============================================================
// SAVE PHOTO LIBRARY
// ============================================================

function savePhotoLibrary() {

    try {

        localStorage.setItem(
            "portfolio_photo_library",
            JSON.stringify(photoLibrary)
        );

    } catch (error) {

        console.error(
            "❌ Photo library save failed:",
            error
        );

        showToast(
            "Photo library storage is full.",
            "warning"
        );
    }
}


// ============================================================
// ADD PHOTO TO LIBRARY
// ============================================================

function addPhotoToLibrary(file) {

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {

        showToast(
            "Please select an image.",
            "warning"
        );

        return;
    }

    const reader =
        new FileReader();

    reader.onload =
        event => {

            const photo = {

                id:
                    "photo_" +
                    Date.now(),

                name:
                    file.name,

                url:
                    event.target.result
            };

            photoLibrary.push(photo);

            savePhotoLibrary();

            renderPhotoLibrary();

            showToast(
                "Photo added to library!",
                "success"
            );
        };

    reader.readAsDataURL(file);
}


// ============================================================
// DELETE PHOTO
// ============================================================

function deletePhotoFromLibrary(index) {

    photoLibrary.splice(
        index,
        1
    );

    savePhotoLibrary();

    renderPhotoLibrary();
}


// ============================================================
// RENDER PHOTO LIBRARY
// ============================================================

function renderPhotoLibrary() {

    const container =
        document.getElementById(
            "photo-library"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    photoLibrary.forEach(
        (photo, index) => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "relative group";

            item.draggable = true;

            item.innerHTML = `

                <img
                    src="${escapeAttribute(photo.url)}"
                    alt="${escapeAttribute(photo.name)}"
                    class="w-20 h-20 object-cover rounded-lg border border-slate-700 cursor-grab"
                >

                <button
                    type="button"
                    class="absolute top-1 right-1 hidden group-hover:block bg-red-600 text-white rounded-full w-5 h-5 text-xs"
                    data-delete-photo="${index}"
                >
                    ×
                </button>
            `;

           item.addEventListener(
    "dragstart",
    event => {

        draggedPhotoUrl =
            photo.url;

        event.dataTransfer.effectAllowed =
            "copy";

        event.dataTransfer.setData(
            "text/plain",
            photo.url
        );

    }
);
            item
                .querySelector(
                    "[data-delete-photo]"
                )
                ?.addEventListener(
                    "click",
                    () => {

                        deletePhotoFromLibrary(
                            index
                        );
                    }
                );

            container.appendChild(item);
        }
    );
}


// ============================================================
// INITIALIZE PHOTO LIBRARY
// ============================================================

function initializePhotoLibrary() {

    loadPhotoLibrary();

    renderPhotoLibrary();

    const input =
        document.getElementById(
            "photo-library-input"
        );

    if (input) {

        input.addEventListener(
            "change",
            event => {

                const files =
                    Array.from(
                        event.target.files || []
                    );

                files.forEach(
                    file => {

                        addPhotoToLibrary(
                            file
                        );
                    }
                );

                input.value = "";
            }
        );
    }
}