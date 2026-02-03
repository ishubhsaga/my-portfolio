// Minimal JS: smooth scroll, reveal on scroll, and nav highlight
(function(){
  'use strict'

  // Smooth scrolling for internal links
  function initSmoothScroll(){
    document.querySelectorAll('a[href^="#"]').forEach(function(link){
      link.addEventListener('click', function(e){
        var href = link.getAttribute('href')
        if(href.length > 1){
          var target = document.querySelector(href)
          if(target){
            e.preventDefault()
            target.scrollIntoView({behavior:'smooth',block:'start'})
            history.replaceState(null,'',href)
          }
        }
      })
    })
  }

  // Reveal sections using IntersectionObserver
  function initReveal(){
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('reveal--visible')
          obs.unobserve(entry.target)
        }
      })
    },{threshold:0.12})

    document.querySelectorAll('.section--reveal').forEach(function(el){
      obs.observe(el)
    })
  }

  // Highlight nav links based on section in view
  function initNavHighlight(){
    var sections = document.querySelectorAll('main section[id]')
    var navLinks = document.querySelectorAll('.site-nav a')

    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var id = entry.target.id
        var link = document.querySelector('.site-nav a[href="#'+id+'"]')
        if(entry.isIntersecting){
          navLinks.forEach(function(a){a.removeAttribute('aria-current')})
          if(link) link.setAttribute('aria-current','true')
        }
      })
    },{threshold:0.4})

    sections.forEach(function(s){observer.observe(s)})
  }

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', function(){
    initSmoothScroll();
    initReveal();
    initNavHighlight();
  })

})();
