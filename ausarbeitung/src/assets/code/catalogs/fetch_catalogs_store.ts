 async fetchCatalogs(): void {
            //Meh
            const catalogData = await catalogService.pull.fetchCatalogs();
            if (catalogData) {
                this.catalogs = catalogData;
            }
            const exampleCatalogData = await catalogService.pull.fetchCatalogs(true);
            if (exampleCatalogData) {
                this.examples = exampleCatalogData;
            }
        }