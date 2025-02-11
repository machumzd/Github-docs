import { getDOM } from '../helpers/e2etest.js'

describe('breadcrumbs', () => {
  test('top-level product pages have breadcrumbs and breadcrumbs should exist regardless of header or in-article', async () => {
    const $ = await getDOM('/get-started')
    const links = $('[data-testid=breadcrumbs-in-article] a')
    expect(links.attr('class').includes('d-none')).toBe(false)
  })

  test('links always prefixed with language', async () => {
    const $ = await getDOM('/get-started/quickstart/hello-world')
    const links = $('[data-testid=breadcrumbs-in-article] a')
    links.each((i, element) => {
      expect($(element).attr('href').startsWith('/en/')).toBe(true)
    })
    expect.assertions(3)
  })

  test('top-level hidden /search page has no breadcrumbs', async () => {
    const $ = await getDOM('/search')
    const links = $('[data-testid=breadcrumbs-in-article] a')
    expect(links.length).toBe(0)
    const headers = $('[data-testid=breadcrumbs-header]')
    expect(headers.length).toBe(0)
  })

  test('short titles are preferred', async () => {
    const $ = await getDOM('/get-started/foo/bar')
    const links = $('[data-testid=breadcrumbs-in-article] a:last-child')
    expect(links.text()).toBe('Bar')
  })

  test('article pages have breadcrumbs in article with product, category, maptopic, and article and last breadcrumb is not viewable', async () => {
    const $ = await getDOM('/get-started/quickstart/hello-world')
    const links = $('[data-testid=breadcrumbs-in-article] a')
    expect(links.length).toBe(3)
    expect($(links[0]).text()).toBe('Get started')
    expect($(links[0]).attr('class').includes('d-none')).toBe(false)
    expect($(links[1]).text()).toBe('Quickstart')
    expect($(links[1]).attr('class').includes('d-none')).toBe(false)
    expect($(links[2]).text()).toBe('Hello World')
    expect($(links[2]).attr('class').includes('d-none')).toBe(true)
  })

  test('works for enterprise-server articles too', async () => {
    const $ = await getDOM('/enterprise-server@latest/get-started/quickstart/hello-world')
    const links = $('[data-testid=breadcrumbs-in-article] a')
    expect(links.length).toBe(3)
    expect($(links[0]).text()).toBe('Get started')
    expect($(links[1]).text()).toBe('Quickstart')
    expect($(links[2]).text()).toBe('Hello World')
  })

  test('works for titles that depend on Liquid', async () => {
    const $fpt = await getDOM('/get-started/quickstart/dynamic-title')
    const fptLinks = $fpt('[data-testid=breadcrumbs-in-article] a')
    expect($fpt(fptLinks[2]).text()).toBe('Hello GitHub')

    const $ghec = await getDOM('/enterprise-cloud@latest/get-started/quickstart/dynamic-title')
    const ghecLinks = $ghec('[data-testid=breadcrumbs-in-article] a')
    expect($ghec(ghecLinks[2]).text()).toBe('Greetings GitHub Enterprise Cloud')
  })

  // Note, early access always work for fixture content
  test('top-level product pages have breadcrumbs', async () => {
    const $ = await getDOM('/early-access/secrets/deeper/mariana-trench')
    expect($('[data-testid=breadcrumbs-in-article]').length).toBe(1)
    expect($('[data-testid=breadcrumbs-header]').length).toBe(1)
  })

  test('early access article pages have breadcrumbs with product, category, and article', async () => {
    const $ = await getDOM('/early-access/secrets/deeper/mariana-trench')
    const $breadcrumbTitles = $(
      '[data-testid=breadcrumbs-in-article] [data-testid=breadcrumb-title]'
    )
    const $breadcrumbLinks = $('[data-testid=breadcrumbs-in-article] a')

    expect($breadcrumbTitles.length).toBe(0)
    expect($breadcrumbLinks.length).toBe(2)
    expect($breadcrumbLinks[0].attribs.title).toBe('Deeper secrets')
    expect($breadcrumbLinks[1].attribs.title).toBe('Mariana Trench')
  })
})
