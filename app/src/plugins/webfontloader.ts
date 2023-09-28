export async function loadFonts () {
  const webFontLoader = await import(/* webpackChunkName: "webfontloader" */'webfontloader')

    webFontLoader.load({
        google: {
            families: [
                'Quicksand',
                'Croissant+One',
            ]
        },
        fontactive(familyName: string, fvd: string) {
            console.log(' Font active: ', familyName);
        }
    })
}
