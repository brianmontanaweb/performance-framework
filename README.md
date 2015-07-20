Performance Framework
=============

#Site Performance Framework

I've turned this project into a peformance framework for best practice for a static page website. It's a continually evolving git so create an issue or fork and let me know how to best improve it!

I address multiple issues that arise from testing my site with [Google Page Speed](https://developers.google.com/speed/pagespeed/insights/?url=http%3A%2F%2Fbrianmontana.net) and [Pingdom Website Speed Test](http://tools.pingdom.com/fpt/#!/cnnmtP/http://brianmontana.net/)

I'm using vanilla JavaScript to request images when the user gets close to the image instead of requesting everything at once. Relying on a noscript fallback 

* No page redirects
* Eliminated render blocking JavaScript and CSS
* Enable compression(gzip)
* Leverage browser caching(using .htaccess)
* Minify CSS, HTML and JavaScript
* Optimize images(Imagemin)
* Prioritize visible content(critical)
* Reduce server response time
