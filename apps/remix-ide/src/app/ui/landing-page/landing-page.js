import * as packageJson from '../../../../../../package.json'
import { ViewPlugin } from '@remixproject/engine-web'

const yo = require('yo-yo')
const csjs = require('csjs-inject')
const globalRegistry = require('../../../global/registry')
const GistHandler = require('../../../lib/gist-handler')
const _paq = window._paq = window._paq || []

const css = csjs`
  .text {
    cursor: pointer;
    font-weight: normal;
    max-width: 300px;
    user-select: none;
  }
  .text:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  .homeContainer {
    user-select: none;
    overflow-y: hidden;
  }
  .mainContent {
    overflow-y: auto;
    flex-grow: 3;
  }
  .hpLogoContainer {
    margin: 30px;
    padding-right: 90px;
  }
  .mediaBadge {
   font-size: 2em;
   height: 2em;
   width: 2em;
  }
  .mediaBadge:focus {
    outline: none;
  }
  .image {
    height: 1em;
    width: 1em;
    text-align: center;
  }
  .logoImg {
    height: 4em;
  }
  .content {
    height: 100%;
  }
  .hpSections {
  }
  .rightPanel {
    right: 0;
    position: absolute;
    z-index: 3;
  }
  .remixHomeMedia {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 720px;
  }
  .panels {
    box-shadow: 0px 0px 13px -7px;
  }
  .labelIt {
    margin-bottom: 0;
  }
  .bigLabelSize {
    font-size: 13px;
  }
  .seeAll {
    margin-top: 7px;
    white-space: nowrap;
  }
  .importFrom p {
    margin-right: 10px;
  }
  .logoContainer img{
    height: 150px;
    opacity: 0.7;
  }
  .envLogo {
    height: 16px;
  }
  .cursorStyle {
    cursor: pointer;
  }
  .envButton {
    width: 120px;
    height: 70px;
  }
  .media {
    overflow: hidden;
    width: 400px;
    transition: .5s ease-out;
    z-index: 1000;
  }
  .migrationBtn {
    width: 100px;
  }
}
`

const profile = {
  name: 'home',
  displayName: 'Home',
  methods: [],
  events: [],
  description: ' - ',
  icon: 'assets/img/remixLogo.webp',
  location: 'mainPanel',
  version: packageJson.version
}

export class LandingPage extends ViewPlugin {
  constructor (appManager, verticalIcons, fileManager, filePanel, contentImport) {
    super(profile)
    this.profile = profile
    this.fileManager = fileManager
    this.filePanel = filePanel
    this.contentImport = contentImport
    this.appManager = appManager
    this.verticalIcons = verticalIcons
    this.gistHandler = new GistHandler()
    const themeQuality = globalRegistry.get('themeModule').api.currentTheme().quality
    window.addEventListener('resize', () => this.adjustMediaPanel())
    window.addEventListener('click', (e) => this.hideMediaPanel(e))
    this.twitterFrame = yo`
      <div class="px-2 ${css.media}">
        <a class="twitter-timeline"
          data-width="350"
          data-theme="${themeQuality}"
          data-chrome="nofooter noheader transparent"
          data-tweet-limit="8"
          href="https://twitter.com/EthereumRemix"
        >
        </a>
        <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
      </div>
    `
    this.badgeTwitter = yo`<button
      class="btn-info p-2 m-1 border rounded-circle ${css.mediaBadge} fab fa-twitter"
      id="remixIDEHomeTwitterbtn"
      onclick=${(e) => this.showMediaPanel(e)}
    ></button>`
    this.badgeMedium = yo`<button
      class="btn-danger p-2 m-1 border rounded-circle ${css.mediaBadge} fab fa-medium"
      id="remixIDEHomeMediumbtn"
      onclick=${(e) => this.showMediaPanel(e)}
    ></button>`
    this.twitterPanel = yo`
      <div id="remixIDE_TwitterBlock" class="p-2 mx-0 mb-0 d-none ${css.remixHomeMedia}">
        ${this.twitterFrame}
      </div>
    `
    this.mediumPanel = yo`
      <div id="remixIDE_MediumBlock" class="p-2 mx-0 mb-0 d-none ${css.remixHomeMedia}">
        <div id="medium-widget" class="p-3 ${css.media}">
          <div
            id="retainable-rss-embed"
            data-rss="https://medium.com/feed/remix-ide"
            data-maxcols="1"
            data-layout="grid"
            data-poststyle="external"
            data-readmore="More..."
            data-buttonclass="btn mb-3"
            data-offset="-100"
          >
-        </div>
        </div>
      </div>
    `
    this.adjustMediaPanel()
    globalRegistry.get('themeModule').api.events.on('themeChanged', (theme) => {
      this.onThemeChanged(theme.quality)
    })
  }

  adjustMediaPanel () {
    this.twitterPanel.style.maxHeight = Math.max(window.innerHeight - 150, 200) + 'px'
    this.mediumPanel.style.maxHeight = Math.max(window.innerHeight - 150, 200) + 'px'
  }

  hideMediaPanel (e) {
    const mediaPanelsTitle = document.getElementById('remixIDEMediaPanelsTitle')
    const mediaPanels = document.getElementById('remixIDEMediaPanels')
    if (!mediaPanelsTitle || !mediaPanels) return
    if (!mediaPanelsTitle.contains(e.target) && !mediaPanels.contains(e.target)) {
      this.mediumPanel.classList.remove('d-block')
      this.mediumPanel.classList.add('d-none')
      this.twitterPanel.classList.remove('d-block')
      this.twitterPanel.classList.add('d-none')
    }
  }

  onThemeChanged (themeQuality) {
    const twitterFrame = yo`
      <div class="px-2 ${css.media}">
        <a class="twitter-timeline"
          data-width="350"
          data-theme="${themeQuality}"
          data-chrome="nofooter noheader transparent"
          data-tweet-limit="8"
          href="https://twitter.com/EthereumRemix"
        >
        </a>
        <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
      </div>
    `
    yo.update(this.twitterFrame, twitterFrame)

    const invertNum = (themeQuality === 'dark') ? 1 : 0
    if (this.solEnv.getElementsByTagName('img')[0]) this.solEnv.getElementsByTagName('img')[0].style.filter = `invert(${invertNum})`
    if (this.optimismEnv.getElementsByTagName('img')[0]) this.optimismEnv.getElementsByTagName('img')[0].style.filter = `invert(${invertNum})`
    if (this.solhintEnv.getElementsByTagName('img')[0]) this.solhintEnv.getElementsByTagName('img')[0].style.filter = `invert(${invertNum})`
    if (this.learnEthEnv.getElementsByTagName('img')[0]) this.learnEthEnv.getElementsByTagName('img')[0].style.filter = `invert(${invertNum})`
    if (this.sourcifyEnv.getElementsByTagName('img')[0]) this.sourcifyEnv.getElementsByTagName('img')[0].style.filter = `invert(${invertNum})`
    if (this.moreEnv.getElementsByTagName('img')[0]) this.moreEnv.getElementsByTagName('img')[0].style.filter = `invert(${invertNum})`
    if (this.websiteIcon) this.websiteIcon.style.filter = `invert(${invertNum})`
  }

  showMediaPanel (e) {
    if (e.target.id === 'remixIDEHomeTwitterbtn') {
      this.mediumPanel.classList.remove('d-block')
      this.mediumPanel.classList.add('d-none')
      this.twitterPanel.classList.toggle('d-block')
      _paq.push(['trackEvent', 'pluginManager', 'media', 'twitter'])
    } else {
      this.twitterPanel.classList.remove('d-block')
      this.twitterPanel.classList.add('d-none')
      this.mediumPanel.classList.toggle('d-block')
      _paq.push(['trackEvent', 'pluginManager', 'media', 'medium'])
    }
  }

  render () {
    const startSolidity = async () => {
      await this.appManager.activatePlugin(['solidity', 'udapp', 'solidityStaticAnalysis', 'solidityUnitTesting'])
      this.verticalIcons.select('solidity')
      _paq.push(['trackEvent', 'pluginManager', 'userActivate', 'solidity'])
    }
    const startOptimism = async () => {
      await this.appManager.activatePlugin('optimism-compiler')
      this.verticalIcons.select('optimism-compiler')
      _paq.push(['trackEvent', 'pluginManager', 'userActivate', 'optimism-compiler'])
    }
    const startSolhint = async () => {
      await this.appManager.activatePlugin(['solidity', 'solhint'])
      this.verticalIcons.select('solhint')
      _paq.push(['trackEvent', 'pluginManager', 'userActivate', 'solhint'])
    }
    const startLearnEth = async () => {
      await this.appManager.activatePlugin(['solidity', 'LearnEth', 'solidityUnitTesting'])
      this.verticalIcons.select('LearnEth')
      _paq.push(['trackEvent', 'pluginManager', 'userActivate', 'learnEth'])
    }
    const startSourceVerify = async () => {
      await this.appManager.activatePlugin(['solidity', 'source-verification'])
      this.verticalIcons.select('source-verification')
      _paq.push(['trackEvent', 'pluginManager', 'userActivate', 'source-verification'])
    }
    const startPluginManager = async () => {
      await this.appManager.activatePlugin('pluginManager')
      this.verticalIcons.select('pluginManager')
    }

    globalRegistry.get('themeModule').api.events.on('themeChanged', (theme) => {
      globalRegistry.get('themeModule').api.fixInvert(document.getElementById('remixLogo'))
      globalRegistry.get('themeModule').api.fixInvert(document.getElementById('solidityLogo'))
      globalRegistry.get('themeModule').api.fixInvert(document.getElementById('debuggerLogo'))
      globalRegistry.get('themeModule').api.fixInvert(document.getElementById('learnEthLogo'))
      globalRegistry.get('themeModule').api.fixInvert(document.getElementById('workshopLogo'))
      globalRegistry.get('themeModule').api.fixInvert(document.getElementById('moreLogo'))
      globalRegistry.get('themeModule').api.fixInvert(document.getElementById('solhintLogo'))
    })

    const createLargeButton = (imgPath, envID, envText, callback) => {
      return yo`
        <button
          class="btn border-secondary d-flex mr-3 text-nowrap justify-content-center flex-column align-items-center ${css.envButton}"
          data-id="landingPageStartSolidity"
          onclick=${() => callback()}
        >
          <img class="m-2 align-self-center ${css.envLogo}" id=${envID} src="${imgPath}">
          <label class="text-uppercase text-dark ${css.cursorStyle}">${envText}</label>
        </button>
      `
    }

    // main
    this.solEnv = createLargeButton('assets/img/solidityLogo.webp', 'solidityLogo', 'Solidity', startSolidity)
    // Featured
    this.optimismEnv = createLargeButton('assets/img/optimismLogo.webp', 'optimismLogo', 'Optimism', startOptimism)
    this.solhintEnv = createLargeButton('assets/img/solhintLogo.png', 'solhintLogo', 'Solhint linter', startSolhint)
    this.learnEthEnv = createLargeButton('assets/img/learnEthLogo.webp', 'learnEthLogo', 'LearnEth', startLearnEth)
    this.sourcifyEnv = createLargeButton('assets/img/sourcifyLogo.webp', 'sourcifyLogo', 'Sourcify', startSourceVerify)
    this.moreEnv = createLargeButton('assets/img/moreLogo.webp', 'moreLogo', 'More', startPluginManager)
    this.websiteIcon = yo`<img id='remixHhomeWebsite' class="mr-1 ${css.image}" src="${profile.icon}"></img>`

    const themeQuality = globalRegistry.get('themeModule').api.currentTheme().quality
    const invertNum = (themeQuality === 'dark') ? 1 : 0
    this.solEnv.getElementsByTagName('img')[0].style.filter = `invert(${invertNum})`
    this.optimismEnv.getElementsByTagName('img')[0].style.filter = `invert(${invertNum})`
    this.solhintEnv.getElementsByTagName('img')[0].style.filter = `invert(${invertNum})`
    this.learnEthEnv.getElementsByTagName('img')[0].style.filter = `invert(${invertNum})`
    this.sourcifyEnv.getElementsByTagName('img')[0].style.filter = `invert(${invertNum})`
    this.moreEnv.getElementsByTagName('img')[0].style.filter = `invert(${invertNum})`
    this.websiteIcon.style.filter = `invert(${invertNum})`

    const img = yo`<img class="m-4 ${css.logoImg}" src="assets/img/logo_w1.svg"></img>`
    // to retrieve medium posts
    document.body.appendChild(yo`<script src="https://www.twilik.com/assets/retainable/rss-embed/retainable-rss-embed.js"></script>`)
    const container = yo`
      <div class="${css.homeContainer} d-flex" data-id="landingPageHomeContainer">
        <div class="${css.mainContent} bg-light">
          <div class="d-flex justify-content-between">
            <div class="d-flex flex-column">
              <div class="border-bottom d-flex justify-content-between clearfix py-3 mb-4">
                <div class="mx-4 w-100 d-flex">
                  ${img}
                  <div class="w-80 pl-5 ml-5">
                    <h5 class="mb-1">Remix IDE</h5>
                    <p class="font-weight-bold mb-0 py-1">Hi! This is IDE Remix. Remix is the most popular development environment for ethereum network.</p>
                    <p class="font-weight-bold mb-0 py-1">Each file you create and compile is added to W3C internal blockchain, and you can be confident that any code is executed as in a real blockchain.</p>
                    <p class="font-weight-bold mb-0 py-1">You can find the current task in the bottom left corner. If you need a hint or want to know the answer, you can use the according buttons.</p>
                    <p class="font-weight-bold mb-0 py-1">The task awaits!</p>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    `

    return container
  }
}
