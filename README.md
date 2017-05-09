# Performance Framework

Work will start on this beginning this weekend and all references for practices will be linked at the bottom

## About

A front-end framework to define best performance optimization techniques, linting process and managing a repository; this is the first version and will be linked to a gh-page to measure load times, file weights, methodologies and philosophical reasoning behind them. Leveraging this towards front-end code standards and practices for Blast Radius.

I'm using LazyLoader to request images when the user gets close to the image instead of requesting everything at once . Relying on a noscript fallback for accessibility. Will have a script the runs through the images to construct the noscript fallback.

* No page redirects
* Eliminated render blocking JavaScript and CSS
* Enable compression(gzip)
* Leverage browser caching(using .htaccess)
* Minify CSS, HTML and JavaScript
* Optimize images(Imagemin)
* Prioritize visible content(critical)
* Reduce server response time
