
### CSS and Theming
Please use the BEM naming convention for CSS classes, so that we have uniformly named and understandable classes.

We are using the theming basis from angular material, cutom theme colors have been defined in `idt-theme.scss`

### Assets
Place any images or oder assets in the asset folder.

### Material Components
In case you need a new componetn from the Angular Material library please import and export this one in the `material.module.ts` file so that we have them all in one place.

### Components and Services
Please place componenets that are used throughout the whole application such as footer and header in the **shared** folder.

For each subpage of the application (e.g. company overview) create a new folder and module for that one (e.g see dashboard folder).

All services of the application are placed in the **services** folder (e.g. `api.service.ts`).

### Useful sources

- [Theming Color Palette](http://mcg.mbitson.com)
- [Material Icon Overview](https://material.angular.io/)
- [Angular Material Componewnts](https://material.io/tools/icons)
