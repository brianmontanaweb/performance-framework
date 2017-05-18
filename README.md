# Performance Framework

## About

A front-end framework to define best performance optimization techniques, linting process and managing a repository; this is the first version and will be linked to a gh-page to measure load times, file weights, methodologies and philosophical reasoning behind them. Leveraging this towards front-end code standards and practices for Blast Radius.

## SCSS Architecture

### Settings

Settings include variables of all sorts and imported first.

### Tools

Tools include functions, mixins, helpers, etc: to help enhance building out your front end.

### Vendors

Vendors include css includes like normalize, reset, third party integrations, etc. The anticipation is to overwrite these.

### Base

Element styling that is extremely generic. This is up to your business requirements on how you'll define base styling.

### Layout

Layout classes for handling how components will be presented, it leverages flexbox and relies on postCSS to fill any prefixes where needed.

### Components

This starts the component class based styling: headlines(`.headline`), buttons(`.btn`), inputs(`.checkbox`), etc. I have a few examples in the codebase to help you get started.

### Modules

Modules include multiple components and should require minimal styling.

### Overrides

Overrides are where `!important` any JavaScript applied classes, combinator selectors, ID selectors, etc.

## Performance Issues

List of possible issues you can run into when trying to work towards better performance.

* No page redirects
* Eliminated render blocking JavaScript and CSS
* Enable compression(gzip)
* Leverage browser caching(using .htaccess)
* Minify CSS, HTML and JavaScript
* Optimize images(Imagemin)
* Prioritize visible content(critical)
* Reduce server response time
