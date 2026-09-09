/**
 * Portfolio Templates Rendering Engine
 */

const PortfolioTemplates = {
  escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  generateThemeStyles(theme) {
    const primary = theme.primaryColor || '#6366f1';
    const font = theme.fontFamily || 'Plus Jakarta Sans';
    const isDark = theme.mode !== 'light';

    return `
      <style>
        :root {
          --primary: ${primary};
          --primary-glow: ${primary}40;
          --font-main: '${font}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        body {
          font-family: var(--font-main);
          background-color: ${isDark ? '#0b0f19' : '#f8fafc'};
          color: ${isDark ? '#f1f5f9' : '#0f172a'};
        }

        .text-primary-custom {
          color: ${primary} !important;
        }

        .bg-primary-custom {
          background-color: ${primary} !important;
        }

        .border-primary-custom {
          border-color: ${primary} !important;
        }

        .shadow-glow {
          box-shadow: 0 0 25px var(--primary-glow);
        }

        .hover-glow:hover {
          box-shadow: 0 10px 30px var(--primary-glow);
        }

        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: ${isDark ? '#0b0f19' : '#f1f5f9'};
        }

        ::-webkit-scrollbar-thumb {
          background: ${isDark ? '#334155' : '#cbd5e1'};
          border-radius: 9999px;
        }
      </style>
    `;
  },

  /*
   * SOCIAL LINKS
   * GitHub + LinkedIn + Twitter/X use SVG logos.
   */
  renderSocialLinks(social, isDark, primary) {
    if (!social) return '';

    const buttonClass = `p-2.5 rounded-full ${
      isDark
        ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200'
        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
    } transition-all transform hover:-translate-y-0.5`;

    const links = [];

    // =========================
    // GitHub
    // =========================
    if (social.github) {
      links.push(`
        <a
          href="${this.escapeHTML(social.github)}"
          target="_blank"
          rel="noopener noreferrer"
          class="${buttonClass}"
          title="GitHub"
          aria-label="GitHub"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.418-1.305.762-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.292-1.552 3.295-1.23 3.295-1.23.648 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.623-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.216.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
        </a>
      `);
    }

    // =========================
    // LinkedIn
    // =========================
    if (social.linkedin) {
      links.push(`
        <a
          href="${this.escapeHTML(social.linkedin)}"
          target="_blank"
          rel="noopener noreferrer"
          class="${buttonClass}"
          title="LinkedIn"
          aria-label="LinkedIn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V8.995h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.291zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V8.995h3.564v11.457zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
          </svg>
        </a>
      `);
    }

    // =========================
    // Twitter / X
    // =========================
    if (social.twitter) {
      links.push(`
        <a
          href="${this.escapeHTML(social.twitter)}"
          target="_blank"
          rel="noopener noreferrer"
          class="${buttonClass}"
          title="Twitter / X"
          aria-label="Twitter / X"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.963 6.817H1.684l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
          </svg>
        </a>
      `);
    }

    // =========================
    // Portfolio Studio
    // =========================
    if (social.portfolio) {
      links.push(`
        <a
          href="${this.escapeHTML(social.portfolio)}"
          target="_blank"
          rel="noopener noreferrer"
          class="${buttonClass}"
          title="Portfolio Studio"
          aria-label="Portfolio Studio"
        >
          <i data-lucide="briefcase" class="w-5 h-5"></i>
        </a>
      `);
    }

    // =========================
    // Website
    // =========================
    if (social.website) {
      links.push(`
        <a
          href="${this.escapeHTML(social.website)}"
          target="_blank"
          rel="noopener noreferrer"
          class="${buttonClass}"
          title="Website"
          aria-label="Website"
        >
          <i data-lucide="globe" class="w-5 h-5"></i>
        </a>
      `);
    }

    // =========================
    // Dribbble
    // =========================
    if (social.dribbble) {
      links.push(`
        <a
          href="${this.escapeHTML(social.dribbble)}"
          target="_blank"
          rel="noopener noreferrer"
          class="${buttonClass}"
          title="Dribbble"
          aria-label="Dribbble"
        >
          <i data-lucide="dribbble" class="w-5 h-5"></i>
        </a>
      `);
    }

    // =========================
    // YouTube
    // =========================
    if (social.youtube) {
      links.push(`
        <a
          href="${this.escapeHTML(social.youtube)}"
          target="_blank"
          rel="noopener noreferrer"
          class="${buttonClass}"
          title="YouTube"
          aria-label="YouTube"
        >
          <i data-lucide="youtube" class="w-5 h-5"></i>
        </a>
      `);
    }

    return links.length
      ? `<div class="flex items-center gap-3 flex-wrap">${links.join('')}</div>`
      : '';
  },

  // =========================================================
  // 1. Modern Tech Template
  // =========================================================
  renderModernTech(data) {
    const {
      personal,
      about,
      skills,
      projects,
      experience,
      education,
      customSections,
      theme
    } = data;

    const isDark = theme.mode !== 'light';
    const primary = theme.primaryColor || '#6366f1';

    const cardBg = isDark
      ? 'bg-slate-900/70 border-slate-800'
      : 'bg-white border-slate-200 shadow-sm';

    const subtleText = isDark
      ? 'text-slate-400'
      : 'text-slate-600';

    const skillsByCategory = {};

    if (skills && skills.length) {
      skills.forEach(s => {
        const cat = s.category || 'General';

        if (!skillsByCategory[cat]) {
          skillsByCategory[cat] = [];
        }

        skillsByCategory[cat].push(s);
      });
    }

    return `
      <!-- Navigation -->
      <nav
        class="sticky top-0 z-40 backdrop-blur-md ${
          isDark
            ? 'bg-slate-950/80 border-b border-slate-800/80'
            : 'bg-white/80 border-b border-slate-200/80'
        } py-4 px-6 sm:px-12 transition-all"
      >
        <div class="max-w-6xl mx-auto flex items-center justify-between">

          <a
            href="#hero"
            class="font-bold text-xl tracking-tight flex items-center gap-2"
          >
            <span
              class="w-3 h-3 rounded-full bg-primary-custom shadow-glow"
            ></span>

            ${this.escapeHTML(personal.name || 'Portfolio')}
          </a>

          <div
            class="hidden md:flex items-center gap-8 text-sm font-medium ${subtleText}"
          >
            <a
              href="#about"
              class="hover:text-primary-custom transition-colors"
            >
              About
            </a>

            <a
              href="#skills"
              class="hover:text-primary-custom transition-colors"
            >
              Skills
            </a>

            <a
              href="#projects"
              class="hover:text-primary-custom transition-colors"
            >
              Projects
            </a>

            <a
              href="#experience"
              class="hover:text-primary-custom transition-colors"
            >
              Experience
            </a>

            <a
              href="#contact"
              class="px-4 py-2 rounded-lg bg-primary-custom text-white hover:opacity-90 transition-opacity"
            >
              Contact
            </a>
          </div>
        </div>
      </nav>

      <main
        class="max-w-6xl mx-auto px-6 sm:px-12 py-12 space-y-24"
      >

        <!-- Hero -->
        <section
          id="hero"
          class="pt-6 sm:pt-12 flex flex-col-reverse md:flex-row items-center justify-between gap-12"
        >

          <div class="flex-1 space-y-6">

            ${
              personal.availableForHire
                ? `
              <div
                class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium ${
                  isDark
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }"
              >
                <span
                  class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                ></span>

                ${this.escapeHTML(
                  personal.statusText ||
                  'Available for new opportunities'
                )}
              </div>
            `
                : ''
            }

            <div class="space-y-2">

              <h1
                class="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight"
              >
                Hi, I'm

                <span class="text-primary-custom">
                  ${this.escapeHTML(personal.name)}
                </span>
              </h1>

              <p
                class="text-xl sm:text-2xl font-semibold ${
                  isDark
                    ? 'text-slate-300'
                    : 'text-slate-700'
                }"
              >
                ${this.escapeHTML(personal.title)}
              </p>

            </div>

            <p
              class="text-base sm:text-lg ${subtleText} max-w-2xl leading-relaxed"
            >
              ${this.escapeHTML(personal.bio)}
            </p>

            <!-- CTA -->
            <div
              class="pt-2 flex flex-wrap items-center gap-4"
            >
              <a
                href="#contact"
                class="px-6 py-3 rounded-lg bg-primary-custom text-white font-medium hover:opacity-95 shadow-glow transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <i
                  data-lucide="mail"
                  class="w-4 h-4"
                ></i>

                ${this.escapeHTML(
                  personal.ctaText || 'Get in Touch'
                )}
              </a>
            </div>

            <!-- Social Links -->
            <div class="pt-4">
              ${this.renderSocialLinks(
                personal.social,
                isDark,
                primary
              )}
            </div>

          </div>

          ${
            personal.avatar
              ? `
            <div class="relative group">

              <div
                class="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-70 blur-xl group-hover:opacity-100 transition duration-1000"
              ></div>

              <div
                class="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 ${
                  isDark
                    ? 'border-slate-800'
                    : 'border-white'
                } shadow-2xl"
              >
                <img
                  src="${this.escapeHTML(personal.avatar)}"
                  alt="${this.escapeHTML(personal.name)}"
                  class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

            </div>
          `
              : ''
          }

        </section>

        <!-- About -->
        ${
          about &&
          (
            about.summary ||
            (about.highlights &&
              about.highlights.length)
          )
            ? `
          <section
            id="about"
            class="space-y-8 scroll-mt-24"
          >

            <div class="flex items-center gap-3">

              <span
                class="w-8 h-1 bg-primary-custom rounded-full"
              ></span>

              <h2
                class="text-2xl sm:text-3xl font-bold tracking-tight"
              >
                ${this.escapeHTML(
                  about.heading || 'About Me'
                )}
              </h2>

            </div>

            <div
              class="p-6 sm:p-8 rounded-2xl border ${cardBg} space-y-6"
            >

              ${
                about.summary
                  ? `
                <p
                  class="text-base sm:text-lg leading-relaxed ${subtleText}"
                >
                  ${this.escapeHTML(about.summary)}
                </p>
              `
                  : ''
              }

              ${
                about.highlights &&
                about.highlights.length
                  ? `
                <div
                  class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t ${
                    isDark
                      ? 'border-slate-800'
                      : 'border-slate-100'
                  }"
                >

                  ${about.highlights
                    .map(
                      h => `
                    <div
                      class="flex items-start gap-3"
                    >
                      <div
                        class="p-1 rounded-full bg-primary-custom/10 text-primary-custom mt-0.5"
                      >
                        <i
                          data-lucide="check"
                          class="w-4 h-4"
                        ></i>
                      </div>

                      <span
                        class="text-sm font-medium ${
                          isDark
                            ? 'text-slate-300'
                            : 'text-slate-700'
                        }"
                      >
                        ${this.escapeHTML(h)}
                      </span>
                    </div>
                  `
                    )
                    .join('')}

                </div>
              `
                  : ''
              }

            </div>

          </section>
        `
            : ''
        }

        <!-- Skills -->
        ${
          skills && skills.length
            ? `
          <section
            id="skills"
            class="space-y-8 scroll-mt-24"
          >

            <div class="flex items-center gap-3">

              <span
                class="w-8 h-1 bg-primary-custom rounded-full"
              ></span>

              <h2
                class="text-2xl sm:text-3xl font-bold tracking-tight"
              >
                Skills & Technologies
              </h2>

            </div>

            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >

              ${Object.keys(skillsByCategory)
                .map(
                  category => `
                <div
                  class="p-6 rounded-2xl border ${cardBg} space-y-4"
                >

                  <h3
                    class="text-sm font-semibold tracking-wider uppercase text-primary-custom"
                  >
                    ${this.escapeHTML(category)}
                  </h3>

                  <div class="flex flex-wrap gap-2">

                    ${skillsByCategory[category]
                      .map(
                        s => `
                      <div
                        class="px-3 py-1.5 rounded-lg text-xs font-medium border ${
                          isDark
                            ? 'bg-slate-800/80 border-slate-700/80 text-slate-200'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }"
                      >
                        ${this.escapeHTML(s.name)}
                      </div>
                    `
                      )
                      .join('')}

                  </div>

                </div>
              `
                )
                .join('')}

            </div>

          </section>
        `
            : ''
        }

        <!-- Projects -->
        ${
          projects && projects.length
            ? `
          <section
            id="projects"
            class="space-y-8 scroll-mt-24"
          >

            <div class="flex items-center gap-3">

              <span
                class="w-8 h-1 bg-primary-custom rounded-full"
              ></span>

              <h2
                class="text-2xl sm:text-3xl font-bold tracking-tight"
              >
                Featured Projects
              </h2>

            </div>

            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >

              ${projects
                .map(
                  p => `
                <div
                  class="group flex flex-col rounded-2xl border ${cardBg} overflow-hidden hover-glow transition-all duration-300 transform hover:-translate-y-1"
                >

                  ${
                    p.image
                      ? `
                    <div
                      class="h-48 overflow-hidden relative"
                    >
                      <img
                        src="${this.escapeHTML(p.image)}"
                        alt="${this.escapeHTML(p.title)}"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  `
                      : ''
                  }

                  <div
                    class="p-6 flex-1 flex flex-col justify-between space-y-4"
                  >

                    <div class="space-y-2">

                      <h3
                        class="text-xl font-bold tracking-tight group-hover:text-primary-custom transition-colors"
                      >
                        ${this.escapeHTML(p.title)}
                      </h3>

                      ${
                        p.subtitle
                          ? `
                        <p
                          class="text-xs font-semibold text-primary-custom"
                        >
                          ${this.escapeHTML(
                            p.subtitle
                          )}
                        </p>
                      `
                          : ''
                      }

                      <p
                        class="text-sm ${subtleText} line-clamp-3 leading-relaxed"
                      >
                        ${this.escapeHTML(
                          p.description
                        )}
                      </p>

                    </div>

                    <div class="space-y-4 pt-2">

                      ${
                        p.tags && p.tags.length
                          ? `
                        <div
                          class="flex flex-wrap gap-1.5"
                        >

                          ${p.tags
                            .map(
                              t => `
                            <span
                              class="px-2 py-0.5 rounded text-[11px] font-medium ${
                                isDark
                                  ? 'bg-slate-800 text-slate-300'
                                  : 'bg-slate-100 text-slate-700'
                              }"
                            >
                              ${this.escapeHTML(t)}
                            </span>
                          `
                            )
                            .join('')}

                        </div>
                      `
                          : ''
                      }

                      <div
                        class="flex items-center gap-3 pt-2 border-t ${
                          isDark
                            ? 'border-slate-800'
                            : 'border-slate-100'
                        }"
                      >

                        ${
                          p.demoUrl
                            ? `
                          <a
                            href="${this.escapeHTML(p.demoUrl)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-xs font-semibold text-primary-custom hover:underline flex items-center gap-1"
                          >
                            Live Demo

                            <i
                              data-lucide="external-link"
                              class="w-3.5 h-3.5"
                            ></i>
                          </a>
                        `
                            : ''
                        }

                        ${
                          p.githubUrl
                            ? `
                          <a
                            href="${this.escapeHTML(p.githubUrl)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="${subtleText} hover:text-primary-custom text-xs font-semibold flex items-center gap-1"
                          >
                            GitHub

                            <i
                              data-lucide="github"
                              class="w-3.5 h-3.5"
                            ></i>
                          </a>
                        `
                            : ''
                        }

                      </div>

                    </div>

                  </div>

                </div>
              `
                )
                .join('')}

            </div>

          </section>
        `
            : ''
        }

        <!-- Contact CTA -->
        <section
          id="contact"
          class="scroll-mt-24"
        >

          <div
            class="p-8 sm:p-12 rounded-3xl border ${cardBg} text-center space-y-6 shadow-2xl"
          >

            <h2
              class="text-3xl sm:text-4xl font-extrabold tracking-tight"
            >
              Let's work together
            </h2>

            <div
              class="flex flex-wrap items-center justify-center gap-4 pt-2"
            >

              ${
                personal.email
                  ? `
                <a
                  href="mailto:${this.escapeHTML(personal.email)}"
                  class="px-8 py-3.5 rounded-xl bg-primary-custom text-white font-semibold shadow-glow flex items-center gap-2 text-base"
                >
                  <i
                    data-lucide="send"
                    class="w-4 h-4"
                  ></i>

                  Send Message
                </a>
              `
                  : ''
              }

            </div>

            <div
              class="pt-6 border-t ${
                isDark
                  ? 'border-slate-800/80'
                  : 'border-slate-200'
              } text-xs ${subtleText}"
            >
              &copy;
              ${new Date().getFullYear()}
              ${this.escapeHTML(personal.name)}.
              All rights reserved.
            </div>

          </div>

        </section>

      </main>
    `;
  },

  // =========================================================
  // 2. Bento Grid Template
  // =========================================================
  renderBentoGrid(data) {
    const {
      personal,
      about,
      skills,
      projects,
      theme
    } = data;

    const isDark = theme.mode !== 'light';

    const cardBg = isDark
      ? 'bg-slate-900/80 border-slate-800/80'
      : 'bg-white border-slate-200 shadow-sm';

    const subtleText = isDark
      ? 'text-slate-400'
      : 'text-slate-600';

    return `
      <div
        class="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8"
      >

        <header
          class="flex items-center justify-between pb-4 border-b ${
            isDark
              ? 'border-slate-800'
              : 'border-slate-200'
          }"
        >
          <span
            class="font-bold text-lg tracking-tight"
          >
            ${this.escapeHTML(personal.name)}
          </span>
        </header>

        <div
          class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >

          <!-- Main -->
          <div
            class="md:col-span-2 lg:col-span-2 p-8 rounded-3xl border ${cardBg} space-y-4"
          >

            <h1
              class="text-3xl sm:text-4xl font-black"
            >
              ${this.escapeHTML(personal.name)}
            </h1>

            <p
              class="text-lg font-bold text-primary-custom"
            >
              ${this.escapeHTML(personal.title)}
            </p>

            <p
              class="text-sm ${subtleText}"
            >
              ${this.escapeHTML(personal.bio)}
            </p>

            <!-- Social Links -->
            <div class="pt-3">
              ${this.renderSocialLinks(
                personal.social,
                isDark,
                theme.primaryColor || '#6366f1'
              )}
            </div>

          </div>

          ${
            about && about.summary
              ? `
            <div
              class="md:col-span-1 lg:col-span-2 p-6 sm:p-8 rounded-3xl border ${cardBg}"
            >

              <span
                class="text-xs font-bold uppercase text-primary-custom"
              >
                About
              </span>

              <p
                class="text-sm ${subtleText} mt-2"
              >
                ${this.escapeHTML(about.summary)}
              </p>

            </div>
          `
              : ''
          }

          ${
            skills && skills.length
              ? `
            <div
              class="md:col-span-2 lg:col-span-2 p-6 rounded-3xl border ${cardBg}"
            >

              <span
                class="text-xs font-bold uppercase text-primary-custom"
              >
                Skills
              </span>

              <div
                class="flex flex-wrap gap-2 mt-2"
              >

                ${skills
                  .map(
                    s => `
                  <span
                    class="px-3 py-1.5 rounded-xl text-xs font-semibold ${
                      isDark
                        ? 'bg-slate-800 text-slate-200'
                        : 'bg-slate-100 text-slate-800'
                    }"
                  >
                    ${this.escapeHTML(s.name)}
                  </span>
                `
                  )
                  .join('')}

              </div>

            </div>
          `
              : ''
          }

          ${
            projects && projects.length
              ? projects
                  .map(
                    p => `
              <div
                class="md:col-span-1 lg:col-span-2 p-6 rounded-3xl border ${cardBg} space-y-2"
              >

                <h3
                  class="font-bold text-lg"
                >
                  ${this.escapeHTML(p.title)}
                </h3>

                <p
                  class="text-xs ${subtleText}"
                >
                  ${this.escapeHTML(
                    p.description
                  )}
                </p>

              </div>
            `
                  )
                  .join('')
              : ''
          }

        </div>
      </div>
    `;
  },

  // =========================================================
  // 3. Executive Minimalist Template
  // =========================================================
  renderExecutive(data) {
    const {
      personal,
      about,
      skills,
      projects,
      theme
    } = data;

    const isDark = theme.mode !== 'light';

    const subtleText = isDark
      ? 'text-slate-400'
      : 'text-slate-600';

    const borderColor = isDark
      ? 'border-slate-800'
      : 'border-slate-200';

    return `
      <div
        class="max-w-4xl mx-auto px-6 sm:px-12 py-16 space-y-16"
      >

        <header
          class="space-y-4 pb-8 border-b ${borderColor}"
        >

          <h1
            class="text-4xl sm:text-5xl font-serif"
          >
            ${this.escapeHTML(personal.name)}
          </h1>

          <p
            class="text-lg ${subtleText}"
          >
            ${this.escapeHTML(personal.title)}
          </p>

          <p
            class="text-base ${subtleText} max-w-2xl leading-relaxed"
          >
            ${this.escapeHTML(personal.bio)}
          </p>

          <!-- Social Links -->
          <div class="pt-3">
            ${this.renderSocialLinks(
              personal.social,
              isDark,
              theme.primaryColor || '#6366f1'
            )}
          </div>

        </header>

        ${
          about && about.summary
            ? `
          <section class="space-y-3">

            <h2
              class="text-xs font-mono uppercase tracking-widest text-primary-custom font-bold"
            >
              01 / Overview
            </h2>

            <p
              class="text-base leading-relaxed ${subtleText}"
            >
              ${this.escapeHTML(about.summary)}
            </p>

          </section>
        `
            : ''
        }

        ${
          projects && projects.length
            ? `
          <section class="space-y-6">

            <h2
              class="text-xs font-mono uppercase tracking-widest text-primary-custom font-bold"
            >
              02 / Selected Works
            </h2>

            ${projects
              .map(
                p => `
              <div
                class="p-6 rounded-xl border ${borderColor} space-y-2"
              >

                <h3
                  class="text-lg font-serif"
                >
                  ${this.escapeHTML(p.title)}
                </h3>

                <p
                  class="text-sm ${subtleText}"
                >
                  ${this.escapeHTML(
                    p.description
                  )}
                </p>

              </div>
            `
              )
              .join('')}

          </section>
        `
            : ''
        }

      </div>
    `;
  },

  // =========================================================
  // 4. Developer Terminal Template
  // =========================================================
  renderDeveloperTerminal(data) {
    const {
      personal,
      skills,
      projects
    } = data;

    return `
      <div
        class="max-w-5xl mx-auto px-4 sm:px-8 py-8 font-mono text-sm"
      >

        <div
          class="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl"
        >

          <!-- Terminal Header -->
          <div
            class="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between"
          >

            <div class="flex items-center gap-2">

              <span
                class="w-3 h-3 rounded-full bg-red-500 inline-block"
              ></span>

              <span
                class="w-3 h-3 rounded-full bg-yellow-500 inline-block"
              ></span>

              <span
                class="w-3 h-3 rounded-full bg-green-500 inline-block"
              ></span>

            </div>

            <span
              class="text-xs text-slate-400 font-medium"
            >
              bash —
              ${this.escapeHTML(
                personal.name
                  .toLowerCase()
                  .replace(/\s+/g, '-')
              )}@portfolio:~
            </span>

          </div>

          <div
            class="p-6 sm:p-10 space-y-8"
          >

            <!-- Who Am I -->
            <div class="space-y-2">

              <div
                class="flex items-center gap-2"
              >

                <span
                  class="text-emerald-400"
                >
                  ➜
                </span>

                <span
                  class="text-indigo-400 font-bold"
                >
                  ~
                </span>

                <span
                  class="text-cyan-300"
                >
                  whoami
                </span>

              </div>

              <div
                class="pl-6 border-l-2 border-slate-800"
              >

                <h1
                  class="text-2xl font-bold text-white"
                >
                  ${this.escapeHTML(
                    personal.name
                  )}
                </h1>

                <p
                  class="text-emerald-400"
                >
                  ${this.escapeHTML(
                    personal.title
                  )}
                </p>

                <p
                  class="text-slate-300 text-sm mt-2"
                >
                  ${this.escapeHTML(
                    personal.bio
                  )}
                </p>

              </div>

            </div>

            <!-- Skills -->
            ${
              skills && skills.length
                ? `
              <div class="space-y-2">

                <div
                  class="flex items-center gap-2"
                >

                  <span
                    class="text-emerald-400"
                  >
                    ➜
                  </span>

                  <span
                    class="text-indigo-400 font-bold"
                  >
                    ~
                  </span>

                  <span
                    class="text-cyan-300"
                  >
                    cat skills.json
                  </span>

                </div>

                <div
                  class="pl-6 border-l-2 border-slate-800 flex flex-wrap gap-2"
                >

                  ${skills
                    .map(
                      s => `
                    <span
                      class="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-300 text-xs"
                    >
                      "${this.escapeHTML(
                        s.name
                      )}"
                    </span>
                  `
                    )
                    .join('')}

                </div>

              </div>
            `
                : ''
            }

          </div>

        </div>

      </div>
    `;
  },

  // =========================================================
  // Main Render Function
  // =========================================================
  render(data) {
    if (!data) return '';

    const templateName =
      (data.theme &&
        data.theme.template) ||
      'modern-tech';

    let bodyContent = '';

    switch (templateName) {
      case 'bento-grid':
        bodyContent =
          this.renderBentoGrid(data);
        break;

      case 'executive':
        bodyContent =
          this.renderExecutive(data);
        break;

      case 'developer-terminal':
        bodyContent =
          this.renderDeveloperTerminal(data);
        break;

      default:
        bodyContent =
          this.renderModernTech(data);
        break;
    }

    return `
      <!DOCTYPE html>

      <html lang="en">

      <head>

        <meta charset="UTF-8">

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        >

        <title>
          ${this.escapeHTML(
            data.personal.name ||
            'Portfolio'
          )}
        </title>

        <!-- Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>

        <!-- Lucide Icons -->
        <script src="https://unpkg.com/lucide@latest"></script>

        ${this.generateThemeStyles(
          data.theme || {}
        )}

      </head>

      <body
        class="min-h-screen antialiased"
      >

        ${bodyContent}

        <script>
          if (window.lucide) {
            lucide.createIcons();
          }
        </script>

      </body>

      </html>
    `;
  }
};