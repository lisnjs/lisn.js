# Contributing to LISN.js

Contributions to LISN are always welcome!

## Types of contributions

### Reporting issues or submitting feature requests

1. Check existing issues, **including closed ones**.
2. Create an issue using one of the pre-defined templates and follow the
   guidelines of the template.

### Documentation updates

The documentation is generated from TypeDoc comments in the source code.

- If you can, edit the code (follow guidelines below) and submit a pull request.
- Otherwise, create an issue for it and clearly describe the changes.

### New demos

The demos are hosted on the website and each one should be available in React
version, JavaScript API and HTML API.

- If you can, edit the website code.
  - Duplicate an existing demo folder and edit the copy.
  - Fork the StackBlitz/CodePen demos and edit those copies.
  - Update URLs for the sandboxes.
- Otherwise, just create a sandbox for the demo on StackBlitz/CodePen and create
  an issue asking for it to be added to the site.

### Code changes

1. **Fork the repository**

2. **Clone the forked repository**

   ```sh
   git clone git@github.com:your-username/lisn.js.git
   cd lisn.js
   ```

3. **Install dependencies**

   ```sh
   npm install -D
   ```

4. **Create a new branch**

   ```sh
   git checkout -b feature-branch-name
   ```

5. **Make your changes**

   - Please follow the project's **coding style** (see below).
   - Check for typos.

6. **Rebuild**

   ```sh
   npm run dist
   ```

7. **Add/update unit tests and or manual tests**

   - If adding new functionality, write corresponding **unit tests** and if relevant **manual (browser) tests**.
   - Tests are in [packages/lisn.js/tests](https://github.com/lisnjs/lisn.js/tree/main/packages/lisn.js/tests)

8. **Run ALL tests**

   ```sh
   npm run test
   ```

9. **Rebuild doc if relevant and test**

   - If you made any changes to the doc, then `npm run doc`
   - Then open `website/public/docs/index.html` in your browser and check
     changes

10. **Commit your changes**

    - If you made many separate changes, commit each separately.
    - Use a descriptive title that summarises all changes.
    - Clearly list each change in the commit message. Style similar to [CHANGELOG](https://github.com/lisnjs/lisn.js/blob/main/packages/lisn.js/CHANGELOG.md).
    - Mention related issue numbers if applicable.

11. **Push your changes**

```sh
git push origin feature-branch-name
```

12. **Submit a pull request (PR)**
    - Clearly list each change in the PR description.
    - Mention related issue numbers if applicable

### Code Style Guidelines

- Understand current code style and follow it.
- Ensure your editor is configured to use the **ESLint configuration** for the
  repository and automatically lint and fix on save (or you do it manually)
- Keep code **modular and reusable**. Keep it DRY.
- Keep code **clear and readable**.
  - Don't use funny shorthands or one-liners.
  - Keep functions as short as is practical and sensible
    - It's ok to split code into a separate function even if used only once.
- Keep strong typing. Minimise type assertions to only absolute necessary ones.
- Document ALL functions and components with **TypeDoc comments**.
- Keep in mind minification. If a given long literal string or property name is
  to be used more than once, declare it as a constant so that minifiers can do
  their job.

## Thank you for helping make LISN better
