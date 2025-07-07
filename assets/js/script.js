// Wait for the DOM to finish loading before running

document.addEventListener('DOMContentLoaded', function() {

    // --------------------- EmailJS

    // ------------ Initialise EmailJs service

    (function(){
        emailjs.init({
          publicKey: "7csZIXHjvuV0I0E82",
        });
     })();

    //  ------------------ Contact forms

    /* Get contact form(s) from the page and if found, pass to handler
       function */

    const contactForms = document.querySelectorAll('.contact-form');

    if (contactForms.length > 0) {
        for (let form of contactForms) {
            handleContactFormEmailJS(form);
        }
    }

    /* Get Google reCAPTCHA(s) from the page and if found, pass to
       handler function for resizing */
    
    const captchas = document.querySelectorAll('.g-recaptcha');

    if (captchas.length > 0) {
        for (let captcha of captchas) {
            // grecaptcha.enterprise.ready(resizeCaptcha(captcha));
            /* have to use jquery '.on' instead of 'addEventListener'
               for Bootstrap 4.3 modal events compatability */
            $('#email-info-modal').on('shown.bs.modal', () => resizeCaptcha(captcha));
            window.addEventListener('resize', () => resizeCaptcha(captcha));
        }
    }

    // -------------------- Main menu

    /* Get main menu from the DOM and pass to handler functions if
       found */

    const menu = document.querySelector('#main-menu');

    if (menu) {
        // Set initial aria properties based on screen size
        handleMainMenuAria (menu);

        // Handle main dropdown menu behaviour (event listeners)
        handleMainMenuDropdown(menu);
    }

    // ----------------- Navigation dropdowns

    /* Get all navigation dropdown lists from the page and if found, pass each
       one to handler function */

    const dropdowns = document.querySelectorAll('.navbar-dropdown-menu-container');

    if (dropdowns.length > 0) {
        for (let dropdown of dropdowns) {
            handleDropdownMenu(dropdown);
        }
    }

    /* Get all navigation dropdown list link from the page and, if found, get any
       sections from the page that they might link to. If sections found, pass both
       lists to handler function along with appropriate 'active' class for styling */

    const navbarDropdownLinks = document.querySelectorAll('.navbar-dropdown-item');
    const activeClass = 'active-link'

    if (navbarDropdownLinks.length > 0) {
        const navbarLinkedEls = document.querySelectorAll('.navbar-linked-section');
        if (navbarLinkedEls.length > 0) {
            handleActiveLinkStyleOnScroll(navbarDropdownLinks, navbarLinkedEls, activeClass);
        }
    }

    // ---------------------- Footer

    // Set current year in copyright statement if found

    const copYears = document.querySelectorAll('.copyright-year');
    
    if (copYears.length > 0) {
        for (let copYear of copYears) {
            copYear.innerHTML = new Date().getFullYear();
        }
    }

    // ---------------------- Modals

    const modals = document.querySelectorAll('.modal');

    if (modals.length > 0) {
        for (let modal of modals) {
            trapKeyNavFocus(modal);
        }
    }

    // -------------------- Carousels

    const carouselContainers = document.querySelectorAll('.carousel-container');

    if (carouselContainers.length > 0) {
        for (let container of carouselContainers) {
            handleCarousel(container);
        }
    }

    // ------------------- Landing Page

    /* Get call to action carousel container element from landing page and,
       if found, pass to carousel handler function */

    // const ctaCarousel = document.querySelector('#cta-carousel-container');

    // if (ctaCarousel) {
    //     handleCarousel(ctaCarousel);
    // }
});

// -------------------- Handler functions

// ------------------------ Main menu

/**
 * Get main menu button, items list and navigation links. Set their
 * initial aria and focus properties based on screen width (i.e. if
 * in dropdown menu mode).
 * 
 * Add event listener to set aria and focus properties of all
 * elements if screen is resized (e.g. mobile device flipped
 * between portrait & landscape mode).
 * 
 * @param {HTMLElement} menu - Main header navigation menu nav element.
 */
 function handleMainMenuAria (menu) {
    const button = menu.querySelector('#main-menu-btn')
    const dropdown = menu.querySelector('#main-menu-items');
    const menuOpenClass = 'main-menu-open';
    const links = dropdown.querySelectorAll('.main-menu-item');

    if (window.innerWidth <= 768) {
        handlePopupAria(button, menuOpenClass);
    }
       
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            button.setAttribute('aria-expanded', false);
            dropdown.removeAttribute('aria-hidden');
            for (let link of links) {
                link.removeAttribute('tabindex');
            }
        } else {
            handlePopupAria(button, menuOpenClass);
        }
    });
}

/**
 * Get main header navigation menu toggle button. Set names of
 * toggle button's 'active' class and dropdown menu's 'menu open'
 * class.
 * 
 * Pass toggle button and both class names to handlePopup function.
 * 
 * @param {HTMLElement} menu - Main header navigation menu nav element. 
 */
function handleMainMenuDropdown(menu) {
    const button = menu.querySelector('#main-menu-btn');
    const buttonActiveClass = 'menu-toggle-btn-active';
    const menuOpenClass = 'main-menu-open';

    handlePopup(button, buttonActiveClass, menuOpenClass);
}

// ------------------- Main menu functions end

// ----------------- Navigation dropdown functions

/**
 * Get passed-in dropdown's toggle button and set button 'active'
 * class name. Set dropdown's menu 'open' class name and get menu
 * links.
 * 
 * Pass toggle button and class name(s) to handlePopup and
 * handleDropdownAria functions.
 * 
 * Add event listener to close dropdowns and set appropriate aria 
 * properties if screen is resized (e.g. mobile device flipped
 * between portrait & landscape mode).
 * 
 * Add 'click' event listener to each menu link, passing event
 * handler function as callback to throttleEvent function with
 * 'interval' parameter of 300ms, thus limiting click events to
 * max 3 per second.
 * 
 * On click, after 300ms: close dropdown by passing it to
 * handleCloseNavDropdown function along with button 'active'
 * class; on smaller screens, (width <= 768px), main-menu will be
 * in dropdown mode, so get it along with its toggle button and
 * dropdown menu; set main menu 'open' class and pass it and menu
 * to handleCloseNestedDropdown function, remove 'open' class from
 * main menu dropdown and 'active' class from main menu toggle
 * button, thus closing entire main menu; pass main menu's toggle
 * button and 'open' class to handlePopupAria function.
 * 
 * @param {HTMLElement} dropdown - Element containing or consisting of navigation dropdown to be handled.
 */
 function handleDropdownMenu(dropdown) {
    const dropdownToggleButton = dropdown.querySelector('.menu-toggle-btn');
    const buttonActiveClass = 'menu-toggle-btn-active';
    const dropdownOpenClass = 'navbar-dropdown-open';
    const menuLinks = dropdown.querySelectorAll('.navbar-dropdown-item');


    handleDropdownAria(dropdownToggleButton, dropdownOpenClass);
    handlePopup(dropdownToggleButton, buttonActiveClass, dropdownOpenClass);

    window.addEventListener('resize', () => {
        const ddId = dropdownToggleButton.getAttribute('aria-controls');
        const dropdownMenu = dropdown.querySelector(`#${ddId}`);
        dropdownMenu.classList.remove(dropdownOpenClass);
        handleDropdownAria(dropdownToggleButton, dropdownOpenClass);
        dropdownToggleButton.classList.remove(buttonActiveClass);
    });

    if (menuLinks.length > 0) {
        for (let link of menuLinks) {
            link.addEventListener('click', throttleEvent(e => {
                // Only target link anchor element
                let targetLink = e.target.closest('a');
                if (!targetLink) return;

                setTimeout (() => {
                    if (window.innerWidth <= 768) {
                        const mainMenu = document.querySelector('#main-menu');
                        const mainMenuButton = mainMenu.querySelector('#main-menu-btn');
                        const mainMenuDropdown = mainMenu.querySelector('#main-menu-items');
                        const mainMenuOpenClass = 'main-menu-open';

                        handleCloseNestedDropdowns(mainMenu, buttonActiveClass);
                        mainMenuDropdown.classList.remove(mainMenuOpenClass);
                        mainMenuButton.classList.remove(buttonActiveClass);
                        handlePopupAria(mainMenuButton, mainMenuOpenClass);
                    } else {
                        handleCloseNavdDropdown(dropdown, buttonActiveClass);
                    }
                }, 300);
               // Pass 300ms time interval to throttleEvent function
            }, 300));
        }
    }
}

/**
 * Get passed-in parent element's nested navigation dropdown menus and
 * pass each one, along with passed-in toggle button 'active' class to
 * handler function.
 * 
 * @param {HTMLElement} parentMenu - Element containing navigation dropdowns to be handled.
 * @param {string} togglerActiveClass - Class name denoting toggle button active (popup visible).
 */
 function handleCloseNestedDropdowns(parentMenu, togglerActiveClass) {
    const dropdowns = parentMenu.querySelectorAll('.navbar-dropdown-menu-container');
    for (let dropdown of dropdowns) {
        handleCloseNavdDropdown(dropdown, togglerActiveClass);
    }
}

/**
 * Get passed-in navigation dropdown menu's toggle button and associated
 * menu list. Set 'active' class name for menu list.
 * 
 * Remove 'active' class name from menu list, effectively closing it.
 * Pass toggle button and its associated menu's 'active' class name to
 * handleDropdownAria function.
 * 
 * Remove passed-in 'active' class name from toggler button.
 * 
 * @param {HTMLElement} dropdown - Element containing or consisting of navigation dropdown to be handled.
 * @param {string} togglerActiveClass - Class name denoting toggle button active (popup visible).
 */
 function handleCloseNavdDropdown(dropdown, togglerActiveClass) {
    const ddToggleBtn = dropdown.querySelector('.menu-toggle-btn');
    const ddId = ddToggleBtn.getAttribute('aria-controls');
    const ddMenu = dropdown.querySelector(`#${ddId}`);
    const ddOpenClass = 'navbar-dropdown-open';
    ddMenu.classList.remove(ddOpenClass);
    handleDropdownAria(ddToggleBtn, ddOpenClass);
    ddToggleBtn.classList.remove(togglerActiveClass);
}

// --------------- Navigation dropdown functions end

// --------------------- Popups & dropdowns

// Aria properties

/**
 * Get passed-in toggle button's associated popup element. Get
 * popup's focusable child elements, exempting navigatiion dropdown
 * menu items as they have their own aria-handling function in order
 * to avoid aria-handling clashes between the main dropdown menu and
 * any navigation dropdowns nested within it.
 * 
 * Check popup for passed-in class name to determine if visible.
 * 
 * If popup hidden, set toggle button's aria-expanded attribute to
 * false, set popup's aria-hidden attribute to true and set each
 * focusable element's tabindex attribute to -1, thereby rendering 
 * them non-focusable.
 * 
 * If popup visible, set toggle button's aria-expanded attribute to
 * true, set popup's aria-hidden attribute to false and remove each
 * focusable elements' tabindex attributes so that they become
 * focusable again. Add one-time, 'focusout' event listener to
 * toggle button to set focus to specified element in popup, if any.
 * 
 * @param {HTMLElement} toggleButton - Button controlling popup element to be handled.
 * @param {string} popupOpenClass - Class name denoting popup element visible.
 */
function handlePopupAria (toggleButton, popupOpenClass) {
    const popupId = toggleButton.getAttribute('aria-controls');
    const popup = document.querySelector(`#${popupId}`);
    const elements = popup.querySelectorAll('a:not(.navbar-dropdown-item), audio, button, iframe, input');
    const focusElement = popup.querySelector('.first-focus');
    
    if (!popup.classList.contains(popupOpenClass)) {
        toggleButton.setAttribute('aria-expanded', false);
        popup.setAttribute('aria-hidden', true);
        for (let el of elements) {
            el.setAttribute('tabindex', '-1');
        }
    } else {
        toggleButton.setAttribute('aria-expanded', true);
        popup.setAttribute('aria-hidden', false);
        for (let el of elements) {
            el.removeAttribute('tabindex');
        }

        toggleButton.addEventListener('focusout', () => {
            if (focusElement) {
                focusElement.focus();
            }
        }, {once: true});
    }
}

/**
 * Get passed-in toggle button's associated dropdown element. Get
 * dropdown's focusable child elements.
 * 
 * Check dropdown for passed-in class name to determine if visible.
 * 
 * If dropdown hidden, set toggle button's aria-expanded attribute to
 * false, set dropdown's aria-hidden attribute to true and set each
 * focusable element's tabindex attribute to -1, thereby rendering 
 * them non-focusable.
 * 
 * If dropdown visible, set toggle button's aria-expanded attribute to
 * true, set dropdown's aria-hidden attribute to false and remove each
 * focusable elements' tabindex attributes so that they become
 * focusable again.
 * 
 * @param {HTMLElement} toggleButton - Button controlling dropdown element to be handled.
 * @param {string} dropdownOpenClass - Class name denoting dropdown element visible.
 */
function handleDropdownAria (toggleButton, dropdownOpenClass) {
    const dropdownId = toggleButton.getAttribute('aria-controls');
    const dropdown = document.querySelector(`#${dropdownId}`);
    const elements = dropdown.querySelectorAll('a, button, iframe, input');
    
    if (!dropdown.classList.contains(dropdownOpenClass)) {
        toggleButton.setAttribute('aria-expanded', false);
        dropdown.setAttribute('aria-hidden', true);
        for (let el of elements) {
            el.setAttribute('tabindex', '-1');
        }
    } else {
        toggleButton.setAttribute('aria-expanded', true);
        dropdown.setAttribute('aria-hidden', false);
        for (let el of elements) {
            el.removeAttribute('tabindex');
        }
    }
}

// Main functionality ('click' events)

/**
 * Get passed-in toggle button's associated popup element.
 * 
 * Add 'click' event listener to toggle button, passing event
 * handler function as callback to throttleEvent function with
 * 'interval' parameter of 300ms, thus limiting click events to
 * max 3 per second.
 * 
 * On click: toggle passed-in 'popup open' class on popup or, based
 * on popup type, add/remove appropriate class names and/or call
 * appropriate handler function(s); if appropriate, toggle
 * passed-in 'active' class on toggle button; pass toggle button
 * and 'popup open' class name to handlePopupAria function or, if 
 * popup is a navigation dropdown menu, to handleDropdownAria function.
 * 
 * If appropriate, pass toggle button and both class names to
 * handlePopupExternalEvent function.
 * 
 * @param {HTMLElement} toggleButton - Button controlling popup element to be handled.
 * @param {string} togglerActiveClass - Class name denoting toggle button active (popup visible).
 * @param {string} popupOpenClass - Class name denoting popup element visible.
 */
function handlePopup(toggleButton, togglerActiveClass, popupOpenClass) {
    const popupId = toggleButton.getAttribute('aria-controls');
    const popup = document.querySelector(`#${popupId}`);

    toggleButton.addEventListener('click', throttleEvent(e => {
        // Only target entire button element
        let targetButton = e.target.closest('button');
        if (!targetButton) return;

        /* Specific handling of news & events page article
           dropdowns */
        if (popup.classList.contains('news-item-main') || popup.classList.contains('gig-listing-main')) {
            if (popup.classList.contains(popupOpenClass)) {
                handleCollapseArticle(toggleButton, togglerActiveClass, popupOpenClass);
            } else {
                popup.classList.add(popupOpenClass);
                toggleButton.classList.add(togglerActiveClass);
            }
        /* Specific handling of main menu's nested navigation
           dropdown menus when it's in dropdown mode itself */
        } else if (popup.classList.contains('main-menu-responsive') && popup.classList.contains(popupOpenClass)) {
            handleCloseNestedDropdowns(popup, togglerActiveClass);
            popup.classList.remove(popupOpenClass);
            toggleButton.classList.remove(togglerActiveClass);
        // Handling of generic popups
        } else {
            popup.classList.toggle(popupOpenClass);
            toggleButton.classList.toggle(togglerActiveClass);
        }

        // Handling of aria properties
        if (popup.classList.contains('navbar-dropdown-menu')) {
            handleDropdownAria(toggleButton, popupOpenClass);
        } else {            
            handlePopupAria(toggleButton, popupOpenClass);
        }

        /* Exempt navigation dropdown menus from being passed to 
           external event handler if main menu is in dropdown mode - 
           will be handled along with main menu. Exempt news & events
           page articles from closing on external events in all cases. */
        if (window.innerWidth <= 768) {
            if (!(toggleButton.classList.contains('navbar-dropdown-btn') || toggleButton.classList.contains('article-toggle-btn'))) {
                handlePopupExternalEvent(toggleButton, togglerActiveClass, popupOpenClass);
            }
        } else {
            if (!(toggleButton.classList.contains('article-toggle-btn'))) {
                handlePopupExternalEvent(toggleButton, togglerActiveClass, popupOpenClass);
            }
        }
    // Pass 300ms time interval to throttleEvent function
    }, 300));
}

// External events

/**
 * Get passed-in toggle button's associated popup element.
 * 
 * Check popup for passed-in class name to determine if visible.
 * 
 * If popup visible, add event listeners to window object for click,
 * touch and focus events outside popup and toggle button. If
 * detected: hide popup; pass toggle button and 'popup open' class
 * name to handlePopupAria function or, if popup is a navigation 
 * dropdown menu, to handleDropdownAria function; remove 'active' 
 * class from toggle button.
 * 
 * If main menu is in dropdown mode, (screen <= 768px), navigation
 * dropdown menus won't have been passed in here, (see handlePopup
 * function), so they are dealt with along with the main menu (i.e.
 * passed to handleCloseNestedDropdowns function).
 * 
 * Remove event listeners from window. If appropriate, set focus to
 * toggle button.
 * 
 * @param {HTMLElement} toggleButton - Button controlling popup element to be handled.
 * @param {string} togglerActiveClass - Class name denoting toggle button active (popup visible).
 * @param {string} popupOpenClass - Class name denoting popup element visible.
 */
function handlePopupExternalEvent(toggleButton, togglerActiveClass, popupOpenClass) {
    const popupId = toggleButton.getAttribute('aria-controls');
    const popup = document.querySelector(`#${popupId}`);
    // Boolean variable to indicate keyboard tab key navigation
    let tabKeyNavigation = false;

    // Handler function for event listeners
    const close = e => {
        if (!popup.contains(e.target) && !toggleButton.contains(e.target)) {

            if (popup.classList.contains('main-menu-responsive')) {
                handleCloseNestedDropdowns(popup, togglerActiveClass);
            }

            popup.classList.remove(popupOpenClass);

            if (popup.classList.contains('navbar-dropdown-menu')) {
                handleDropdownAria(toggleButton, popupOpenClass);
            } else {            
                handlePopupAria(toggleButton, popupOpenClass);
            }

            toggleButton.classList.remove(togglerActiveClass);
        } else return;
        
        window.removeEventListener('click', close);
        window.removeEventListener('touchstart', close);
        window.removeEventListener('focusin', close);
        window.removeEventListener('keydown', detectTabbing);

        if (tabKeyNavigation) {
            toggleButton.focus();
        }
    }

    // Event listeners
    if (popup.classList.contains(popupOpenClass)) {
        window.addEventListener('click', close);
        /* Needed for iOS Safari as click events won't bubble up to
           window object */
        window.addEventListener('touchstart', close);
        // Needed for keyboard navigation (tabbing out of popup)
        window.addEventListener('focusin', close);
        /* Listener to detect tab key navigation & set value of
           boolean variable */
        window.addEventListener('keydown', detectTabbing = e => {
            if (e.key === 'Tab' || ((e.keyCode || e.which) === 9)) {
                let tab = true;

                if (tab || (e.shiftKey && tab)) {
                    tabKeyNavigation = true;
                }
            } else {
                tabKeyNavigation = false;
            }
        });
    }
}

// --------------- Popups & dropdowns functions end

// ------------------- Contact Forms & EmailJS

/**
 * Get passed-in form element's child 'success' and 'failure' message
 * div elements and submit button's container div element.
 * 
 * Add 'submit' event listener to passed-in form element.
 * 
 * On submit, set template parameters object to be passed to EmailJS
 * send() method with keys matching EmailJS template variable names
 * and values populated from corresponding field in form element.
 * 
 * Call send() method to submit form details to EmailJS, passing in
 * EmailJS service ID, EmailJS template ID and template parameters
 * object, then await response. On 'success' response, display
 * 'success' message and hide submit button. On 'error' response,
 * display 'failure' message and hide submit button. Change each
 * element's 'aria-hidden' attribute accordingly.
 * 
 * @param {HTMLElement} contactForm - Contact form from 'Contact Us' page or footer email modal: form element.
 */
function handleContactFormEmailJS(contactForm) {
    const successMsg = contactForm.querySelector('.cf-success-message');
    const failureMsg = contactForm.querySelector('.cf-failure-message');
    const submitBtnSection = contactForm.querySelector('.contact-btn-wrapper');

    contactForm.addEventListener('submit', (e) => {
        // Prevent page from refreshing on form submit
        e.preventDefault();
        // get Google reCAPTCHA response token
        let captchaToken = grecaptcha.enterprise.getResponse();
        // Set parameters to be sent to EmailJS template
        // **Key values MUST match variable names in EmailJS template
        let templateParams = {
            'first_name': contactForm.firstname.value,
            'last_name': contactForm.surname.value,
            'email_addr': contactForm.email.value,
            'phone_no': contactForm.phone.value,
            'message': contactForm.message.value,
            "g-recaptcha-response": captchaToken,
        }
        // Call EmailJS send() method to submit form
        emailjs.send('gmail_mhcp', 'contact-form', templateParams).then(
            (response) => {
              console.log('SUCCESS!', response.status, response.text);
              submitBtnSection.classList.add('cf-hidden');
              submitBtnSection.setAttribute('aria-hidden', true);
              successMsg.classList.remove('cf-hidden');
              successMsg.setAttribute('aria-hidden', false);
            },
            (error) => {
              console.log('FAILED...', error);
              submitBtnSection.classList.add('cf-hidden');
              submitBtnSection.setAttribute('aria-hidden', true);
              failureMsg.classList.remove('cf-hidden');
              failureMsg.setAttribute('aria-hidden', false);
            },
        );
    });
}

/**
 * Get form to which passed-in Google reCAPTCHA has been applied and
 * 'div' element (captchaDiv) containing reCAPTCHA iframe, if loaded in.
 * 
 * Get width of form and if less than 304px, add 'transform: scale'
 * style to reCAPTCHA using ratio of captchaDiv to reCAPTCHA's parent
 * element. If width of form greater than 304px, remove style.
 * 
 * @param {HTMLElement} captcha - Div element into which Google reCAPTCHA is dynamically loaded. 
 */
function resizeCaptcha(captcha) {
    const parentForm = captcha.closest('form');
    const captchaDiv = captcha.children[0];

    if (captchaDiv) {
        if (parentForm.getBoundingClientRect().width <= 304) {
        const captchaWidth = captchaDiv.getBoundingClientRect().width;
        const parentWidth = captcha.parentElement.getBoundingClientRect().width;
            captcha.style.transform = `scale(${parentWidth / captchaWidth})`;
        } else {
            captcha.removeAttribute('style');
        }
    }
}

// ------------- Contact Forms & EmailJS functions end

// --------------------------- Carousels

/**
 * Get 'ul' element (track) containing carousel slides from passed-in
 * container element and pass to addClonedSlides() function.
 * 
 * Get all carousel slides and buttons, carousels 'exit node' element and
 * popup 'larger image' modal, if any.
 * 
 * Get width of slides and use to, firstly, set initial position of
 * carousel track, then set data attributes defining each slide's left
 * position on track (used to set property for track transition). Set
 * data attributes defining each slide's nodelist index. If slide's image
 * is child of a link with an 'aria-label' attribute, incorporate image's
 * 'alt' attribute into that link's 'aria-label'. Add 'resize' event
 * listener to window to dynamically change each slide's 'data-left'
 * attribute.
 * 
 * Set data attributes defining each carousel 'dot' indicator's nodelist
 * index (needed for setting 'current' style after carousel transitions)
 * and use that index to set appropriate 'aria-label' attributes.
 * 
 * Add 'transitionend' and 'animationend' event listeners to carousel track
 * to indicate change in track position. Get 'current' slide and pass with
 * track to resetInfiniteCarousel() function.
 * 
 * If carousel is to be auto-scrolling, pass track and setInterval()
 * reference number, if any, to carouselAutoScroll() function, which
 * returns new setInterval() reference. Add 'focus' and 'blur' event
 * listeners to carousel container (with useCapture parameter set to true
 * so that listeners also apply to all children) to stop/restart
 * auto-scrolling when carousel receives/loses focus.
 * 
 * Add 'click' event listener to each carousel button, (using
 * throttleEvent() function to limit clicks to max 2/sec), passing
 * appropraite elements to moveToSlide() function.
 * 
 * If carousel uses 'larger image' modal, add 'click' event listeners
 * to slide links to handle modal content with populateCtaModal() function.
 * Add custom Bootstrap 'shown' and 'hidden' event listeners to modal to
 * handle carousel auto-scrolling, if any, or to return focus to carousel
 * if necessary.
 * 
 * Add 'keydown', 'mousedown', 'keyup', 'focusout' and 'foucusin' event
 * listeners to carousel container, track, window and 'exit node' element
 * to handle keyboard navigation.
 * 
 * Add 'touchstart' event listener to carousel container to handle
 * auto-scrolling, if any. Pass track to handleTouchNavigation() function.
 * 
 * @param {HTMLElement} carouselContainer - Section element containing carousel to be handled.
 */
function handleCarousel(carouselContainer) {
    let track = carouselContainer.querySelector('.carousel-track');
    // add cloned slides for "infinite" carousel
    track = addClonedSlides (track);

    const slides = track.querySelectorAll('.carousel-slide');
    const buttons = carouselContainer.querySelectorAll('.carousel-btn, .carousel-indicator');
    const dots = carouselContainer.querySelectorAll('.carousel-indicator');
    const exitNode = carouselContainer.querySelector('.carousel-exit');
    const imgModal = document.querySelector('#cta-img-modal');

    // get width of slides (should all be the same)
    let slideWidth = slides[0].getBoundingClientRect().width;
    // set initial track position
    track.style.left = `-${slideWidth}px`;
    // set slides' data attributes and if necessary, aria-labels
    for (let [index, slide] of slides.entries()) {
        slide.dataset.left = `${slideWidth * (index)}px`;
        slide.dataset.index = index;
        let slideLink = slide.querySelector('a');
        if (slideLink) {
            let slideImg = slideLink.querySelector('img');
            let slideLinkAria = slideLink.getAttribute('aria-label');
            if (slideLinkAria) {
                slideLink.setAttribute('aria-label', `${slideImg.alt}. ${slideLinkAria}`);
            }
        }
    }
    // adjust track position dynamically on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        slideWidth = slides[0].getBoundingClientRect().width;
        for (let [index, slide] of slides.entries()) {
            slide.dataset.left = `${slideWidth * (index)}px`;
        }
        /* setTimeout variable used to hide track transition until
           400ms after window resize finished */
        if (resizeTimer) clearTimeout(resizeTimer);
        track.classList.add('behind-all');
        const currentSlide = track.querySelector('.current-slide');
        track.style.left = `-${currentSlide.dataset.left}`;
        resizeTimer = setTimeout(() => {
            track.classList.remove('behind-all');
        }, 400);
    });

    // set 'dot' indicators' data and aria-label attributes
    for (let [index, dot] of dots.entries()) {
        dot.dataset.index = index;
        dot.setAttribute('aria-label', `Click to view slide number ${index + 1} of ${dots.length}`)
    }

    // check (& reset) elements on each track position change
    track.addEventListener('transitionend', () => {
        const currentSlide = track.querySelector('.current-slide');
        // set track position for "infinite" scrolling
        resetInfiniteCarousel(track, currentSlide);
    });
    track.addEventListener('animationend', () => {
        const currentSlide = track.querySelector('.current-slide');
        // set track position for "infinite" scrolling
        resetInfiniteCarousel(track, currentSlide);
    });

    // auto-scrolling
    let autoScrollSetInt;
    if (carouselContainer.classList.contains('carousel-auto-scroll')) {
        autoScrollSetInt = carouselAutoScroll(track, autoScrollSetInt);
        // pause auto-scrolling while any element inside carousel has focus
        carouselContainer.addEventListener('focus', () => {
            clearInterval(autoScrollSetInt);
            track.setAttribute('aria-live', 'polite');
        }, true);
        // restart auto-scrolling when focus leaves carousel & children
        carouselContainer.addEventListener('blur', () => {
            autoScrollSetInt = carouselAutoScroll(track, autoScrollSetInt);
        }, true);
    }

    // buttons (click events)
    for (let button of buttons) {
        button.addEventListener('click', throttleEvent(e => {
            // Only target entire button element
            let targetButton = e.target.closest('button');
            if (!targetButton) return;

            const currentSlide = track.querySelector('.current-slide');

            if (button.classList.contains('carousel-next-btn')) {
                const nextSlide = currentSlide.nextElementSibling;
                moveToSlide(track, currentSlide, nextSlide);
            } else if (button.classList.contains('carousel-prev-btn')) {
                const prevSlide = currentSlide.previousElementSibling;
                moveToSlide(track, currentSlide, prevSlide);
            } else if (button.classList.contains('carousel-indicator')) {
                const targetIndex = parseInt(button.dataset.index);
                const targetSlide = slides[targetIndex + 1];
                moveToSlide(track, currentSlide, targetSlide);
            } else return;
        // Pass 500ms time interval to throttleEvent function
        }, 500));
    }

    // image clicks (open modal)
    let openedWithKey = false;  // used to differentiate between mouse & 'Enter' key
    if (imgModal) {
        for (let slide of slides) {
            const slideImgLink = slide.querySelector('a');
            if (slideImgLink) {
                slideImgLink.addEventListener('click', e => {
                    // only target anchor element
                    let targetLink = e.target.closest('a');
                    if (!targetLink) return;
                    // prevent anchor element navigating to its 'href'
                    e.preventDefault();
                    populateCtaModal(imgModal, targetLink);
                });
            }
        }
        /* pause carousel auto-scrolling on modal open, return
           focus to carousel on modal close if using keyboard
           navigation (have to use jquery '.on' instead of
           'addEventListener' for Bootstrap 4.3 modal events
           compatability) */
        $(imgModal).on('shown.bs.modal', () => {
            if (carouselContainer.classList.contains('carousel-auto-scroll')) {
                clearInterval(autoScrollSetInt);
                track.setAttribute('aria-live', 'polite');
            }
        });
        $(imgModal).on('hidden.bs.modal', () => {
            if (openedWithKey) {
                track.focus();
                openedWithKey = false;
            }
        });
    }

    // general keyboard navigation
    carouselContainer.addEventListener('keydown', (e) => {
        // indicator/navigation 'dots'
        if (e.target.classList.contains('carousel-indicator')) {
            if (e.key === 'Tab') {
                e.preventDefault();
            }
            if ((e.key === 'ArrowUp') || (e.key === 'ArrowDown')) {
                /* prevent navigation to slides if carousel is events page 
                   banner 'tv' */
                if (e.target.parentElement.id === 'tv-carousel-nav') return;
                e.preventDefault();
                track.focus();
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                exitNode.setAttribute('aria-hidden', 'false');
                exitNode.focus();
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextDot = e.target.nextElementSibling;
                if (nextDot) {
                    nextDot.focus();
                } else {
                    dots[0].focus();
                }
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevDot = e.target.previousElementSibling;
                if (prevDot) {
                    prevDot.focus();
                } else {
                    dots[dots.length - 1].focus();
                }
            }
        // carousel track/slides
        } else if (e.target === track) {
            if (e.key === 'Tab') {
                e.preventDefault();
            }
            if ((e.key === 'ArrowUp') || (e.key === 'ArrowDown')) {
                e.preventDefault();
                carouselContainer.querySelector('button.current-slide').focus();
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                exitNode.setAttribute('aria-hidden', 'false');
                exitNode.focus();
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                if (imgModal) {
                    const slideLink = track.querySelector('.current-slide a');
                    if (slideLink) {
                        populateCtaModal(imgModal, slideLink);
                    }
                    /* have to use jquery for Bootstrap 4.3 modal compatability
                    - manually display modal */
                    $(imgModal).modal('show');
                    openedWithKey = true;
                }
            }
        // exit node
        } else if (e.target === exitNode) {
            exitNode.setAttribute('aria-hidden', 'true');
            // set focus back to start of carousel if tabbing in reverse
            if ((e.key === 'Tab') && e.shiftKey) {
                e.preventDefault();
                carouselContainer.focus();
            }
        }
    });
    /* throttled event listener for carousel slide keyboard navigation
       - required in order to allow track transition to finish so that
       position is updated */
    track.addEventListener('keydown', throttleEvent(e => {
        const currentSlide = track.querySelector('.current-slide');
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            const nextSlide = currentSlide.nextElementSibling;
            moveToSlide(track, currentSlide, nextSlide);
        }
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevSlide = currentSlide.previousElementSibling;
            moveToSlide(track, currentSlide, prevSlide);
        }
    // Pass 500ms time interval to throttleEvent function
    }, 500));
    // prevent keyboard nav instructions from showing on mouse click
    carouselContainer.addEventListener('mousedown', () => {
        carouselContainer.querySelector('.carousel-keynav-instructions').classList.remove('in-front');
        carouselContainer.querySelector('.carousel-keynav-instructions').classList.add('behind-all');
    });
    /* show keyboard nav instructions when carousel receives focus from
       tab key use */
    window.addEventListener('keyup', (e) => {
        if (e.key === 'Tab') {
            if (e.target === carouselContainer) {
                carouselContainer.querySelector('.carousel-keynav-instructions').classList.remove('behind-all');
                carouselContainer.querySelector('.carousel-keynav-instructions').classList.add('in-front');
            } else {
                carouselContainer.querySelector('.carousel-keynav-instructions').classList.remove('in-front');
                carouselContainer.querySelector('.carousel-keynav-instructions').classList.add('behind-all');
            }
        }
    });
    // hide keyboard nav instructions when focus moves on
    carouselContainer.addEventListener('focusout', () => {
        carouselContainer.querySelector('.carousel-keynav-instructions').classList.remove('in-front');
        carouselContainer.querySelector('.carousel-keynav-instructions').classList.add('behind-all');
    });
    // show carousel exit node when it receives focus
    exitNode.addEventListener('focusin', () => {
        exitNode.classList.remove('behind-all');
    });
    // hide carousel exit node when focus moves on
    exitNode.addEventListener('focusout', () => {
        exitNode.classList.add('behind-all');
    });

    // pause carousel auto-scrolling on touch
    carouselContainer.addEventListener('touchstart', () => {
        if (carouselContainer.classList.contains('carousel-auto-scroll')) {
            clearInterval(autoScrollSetInt);
            track.setAttribute('aria-live', 'polite');
        } 
    });
    // touch/swipe navigation
    handleTouchNavigation(track);
}

/**
 * Clone first and last slides from passed-in track element, including
 * any children and set appropriate classes / aria attributes.
 * 
 * Insert last slide clone at beginning of track and insert first slide
 * clone at end.
 * 
 * Return new track.
 * 
 * @param {HTMLElement} track - Element containing carousel slides.
 * @returns {HTMLElement} - Modified track element.
 */
function addClonedSlides (track) {
    const lastSlideClone = track.lastElementChild.cloneNode(true);
    lastSlideClone.classList.add('last-slide-clone');
    lastSlideClone.classList.remove('last-slide');
    lastSlideClone.setAttribute('aria-hidden', 'true');

    const firstSlideClone = track.firstElementChild.cloneNode(true);
    firstSlideClone.classList.add('first-slide-clone');
    firstSlideClone.classList.remove('first-slide', 'current-slide');
    firstSlideClone.setAttribute('aria-hidden', 'true');

    track.insertBefore(lastSlideClone, track.firstElementChild);
    track.appendChild(firstSlideClone);

    return track;
}

/**
 * Get first and last slides from passed-in track element.
 * 
 * If passed-in currentSlide element is clone of either the first or last
 * slides, remove css 'transition' class from track element (rendering
 * track position change invisible to user) and change track position by
 * setting its left style property from 'data-left' attribute of the slide
 * whose clone was detected.
 * 
 * Switch 'current-slide' class and 'aria-hidden' attributes of currentSlide
 * element and new 'current' slide.
 * 
 * @param {HTMLElement} track - Element containing carousel slides.
 * @param {HTMLElement} currentSlide - Slide element with class indicating that it's currently visible in carousel viewport.
 */
function resetInfiniteCarousel(track, currentSlide) {
    const firstSlide = track.querySelector('.first-slide');
    const lastSlide = track.querySelector('.last-slide');

    if (currentSlide.classList.contains('last-slide-clone')) {
        track.classList.remove('carousel-trans-left');
        track.style.left = `-${lastSlide.dataset.left}`;
        currentSlide.classList.remove('current-slide');
        currentSlide.setAttribute('aria-hidden', 'true');
        lastSlide.classList.add('current-slide');
        lastSlide.setAttribute('aria-hidden', 'false');
    } else if (currentSlide.classList.contains('first-slide-clone')) {
        track.classList.remove('carousel-trans-left');
        track.style.left = `-${firstSlide.dataset.left}`;
        currentSlide.classList.remove('current-slide');
        currentSlide.setAttribute('aria-hidden', 'true');
        firstSlide.classList.add('current-slide');
        firstSlide.setAttribute('aria-hidden', 'false');
    }
}

/**
 * Get first and last 'dot' indicator buttons from passed-in node list.
 * 
 * Remove 'current' class and 'aria-disabled' attribute from each button in
 * list.
 * 
 * If passed-in currentSlide element is clone of either the first or last
 * slides in carousel track element, set 'current' class (for styling) and
 * 'aria-disabled' attribute on first or last button, as appropriate. If
 * currentSlide element's 'data-index' attribute matches button's position in
 * node list (indicated by its own 'data-index' attribute), set 'current'
 * class and 'aria-disabled' attribute on button.
 * 
 * @param {NodeList} dots - Carousel 'dot' indicator buttons.
 * @param {HTMLElement} currentSlide - Slide element with class indicating that it's currently visible in carousel viewport.
 */
function updateDots(dots, currentSlide) {
    const firstDot = dots[0];
    const lastDot = dots[dots.length - 1];

    for (let dot of dots) {
        dot.classList.remove('current-slide');
        dot.removeAttribute('aria-disabled');
        if (currentSlide.classList.contains('last-slide-clone')) {
            lastDot.classList.add('current-slide');
            lastDot.setAttribute('aria-disabled', 'true');
        } else if (currentSlide.classList.contains('first-slide-clone')) {
            firstDot.classList.add('current-slide');
            firstDot.setAttribute('aria-disabled', 'true');
        } else if (currentSlide.dataset.index === `${parseInt(dot.dataset.index) + 1}`) {
            dot.classList.add('current-slide');
            dot.setAttribute('aria-disabled', 'true');
        }
    }
}

/**
 * If user's browser preferences set to 'prefers reduced motion, exit
 * function.
 * 
 * Clear currently running setInterval() function using passed-in reference,
 * so not running multiple functions simultaneously (would continuously
 * increase slide change speed).
 * 
 * Set passed-in track element's 'aria-live' attribute to off and begin new
 * setInterval() function to call moveToSlide() function every 8s.
 * 
 * Return reference for new setInterval() function.
 * 
 * @param {HTMLElement} track - Element containing carousel slides.
 * @param {number} intv - Reference for currently running setInterval() function, if any.
 * @returns {number} - Reference for new setInterval() function.
 */
function carouselAutoScroll(track, intv) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    /* clear interval every time so not running multiple
       setInterval() functions simultaneously, increasing
       slide change speed */
    clearInterval(intv);
    track.setAttribute('aria-live', 'off');
    intv = setInterval(() => {
        const currentSlide = track.querySelector('.current-slide');
        const targetSlide = currentSlide.nextElementSibling;
        moveToSlide(track, currentSlide, targetSlide);
        console.log(intv);
    // 8 sec slide change interval
    }, 8000);
    // return new setInterval() reference
    return intv;
}

/**
 * Get passed-in track element's 'frame' parent element, if any. Get
 * track element's parent carousel's navigation 'dot' indicator buttons.
 * 
 * Get passed-in targetSlide element's 'data-left' attribute, add css
 * 'transition' or 'animation' classes to passed-in track element (and
 * 'frame' element if present) depending on carousel type. Change track
 * position by setting its left style property to targetSlide's
 * 'data-left' attribute, setting timeouts and removing 'animation'
 * classes if called for by carousel type.
 * 
 * Switch 'current-slide' class and 'aria-hidden' attributes of passed-in
 * currentSlide element and targetSlide.
 * 
 * Pass 'dot' indicator buttons and targetSlide to updateDots() function.
 * 
 * @param {HTMLElement} track - Element containing carousel slides.
 * @param {HTMLElement} currentSlide - Slide element with class indicating that it's currently visible in carousel viewport.
 * @param {HTMLElement} targetSlide - Slide element to become visible in carousel viewport.
 */
function moveToSlide(track, currentSlide, targetSlide) {
    const carouselFrame = track.closest('.carousel-frame');
    const dots = track.closest('.carousel-container').querySelectorAll('.carousel-indicator');
    const moveValue = targetSlide.dataset.left;
    
    if (track.classList.contains('carousel-fade')) {
        track.classList.add('carousel-trans-fade');
        if (carouselFrame && carouselFrame.classList.contains('tv-frame')) {
            carouselFrame.classList.add('tv-flicker');
        }
        setTimeout(() => {
            track.style.left = `-${moveValue}`;
        }, 1000);
        setTimeout(() => {
            track.classList.remove('carousel-trans-fade');
            if (carouselFrame && carouselFrame.classList.contains('tv-frame')) {
            carouselFrame.classList.remove('tv-flicker');
            }
        }, 2100);
    } else {
        track.classList.add('carousel-trans-left');
        track.style.left = `-${moveValue}`;
    }
    currentSlide.classList.remove('current-slide');
    currentSlide.setAttribute('aria-hidden', 'true');
    targetSlide.classList.add('current-slide');
    targetSlide.setAttribute('aria-hidden', 'false');
    updateDots(dots, targetSlide);
}

/**
 * Get passed-in modal element's 'title' ('h2') and image container ('div')
 * elements.
 * Clone passed-in anchor element with its children (carousel slide image).
 * Get modal's 'description' element (for screen readers). Create
 * description text from cloned image's 'alt' attribute and paragraph
 * element to contain it.
 * 
 * Remove all redundant attributes from cloned anchor element and set its
 * 'aria-label' attribute, using its 'data-description' attribute.
 * 
 * Clear image container element and append cloned anchor+image element.
 * 
 * Set cloned anchor element's 'data-description' text as modal's title.
 * 
 * Add description text to new paragraph elment, clear 'description'
 * element and append paragraph.
 * 
 * @param {HTMLElement} imgModal - Popup modal element to contain larger version of selected carousel slide image.
 * @param {HTMLElement} imgLink - Anchor element, parent of selected carousel slide image, to be cloned and altered to populate imgModal.
 */
function populateCtaModal(imgModal, imgLink) {
    const title = imgModal.querySelector('.modal-title');
    const imgLinkContainer = imgModal.querySelector('.cta-img-wrapper');
    const newLink = imgLink.cloneNode(true);
    const imgDescription = imgModal.querySelector('.cta-desc');
    const descriptionText = newLink.querySelector('img').alt;
    const descriptionPar = document.createElement('p');

    newLink.removeAttribute('tabindex');
    newLink.removeAttribute('data-toggle');
    newLink.removeAttribute('data-target');
    newLink.removeAttribute('role');
    newLink.setAttribute('aria-label', `${newLink.dataset.description}. Click here for more information.`);
    imgLinkContainer.innerHTML = '';
    imgLinkContainer.appendChild(newLink);
    
    title.innerHTML = newLink.dataset.description;

    descriptionPar.innerHTML = `${descriptionText}. Click the image for more information`;
    imgDescription.innerHTML = '';
    imgDescription.appendChild(descriptionPar);
}

/**
 * Get carousel's main image viewport (track container) & add touch
 * event listeners to it:
 * 
 * 'touchstart' - Record x & y coordinates and time of first touch;
 * 
 * 'touchmove' - Determine if swiping horizontally or vertically.
 * If condition met for valid horizontal swipe, return true and
 * prevent page scrolling for duration of touch.
 * 
 * 'touchend' - Limit touch events to max 2 per second. Record x
 * coordinate at end of touch. If horizontal swipe, prevent click
 * events in viewport, pass start & end x coordinates and time of
 * first touch to handleSwipe function, get returned swipe
 * direction and pass to handleSwipeDirection function.
 * 
 * @param {HTMLElement} track - Element containing carousel slides.
 */
function handleTouchNavigation(track) {
    // Carousel viewport
    const view = track.parentElement;
    // Throttling variable to limit click events
    let enableSwipe = true;
    // Starting X and Y coordinates
    let startX = null;
    let startY = null;
    // Swiping horizontally?
    let swipingX = false;
    // Time of first touch
    let startTime;

    view.addEventListener('touchstart', (e) => {
        // Record x and y coordinates of first touch
        startX = e.changedTouches[0].clientX;
        startY = e.changedTouches[0].clientY;
        // Record time of first touch
        startTime = new Date().getTime();
    });

    view.addEventListener('touchmove', (e) => {
        // To prevent error when maths operations applied:
        if (startX === null || startY === null) return;
        
        // Track distance of touch across screen
        let currentX = e.changedTouches[0].clientX;
        let currentY = e.changedTouches[0].clientY;
        let currentDistX = startX - currentX;
        let currentDistY = startY - currentY;
        // Maximum y-axis distance allowed for horizontal swipe
        let tolerance = 100;

        // Only run if swiping horizontally within tolerance
        if (Math.abs(currentDistX) > Math.abs(currentDistY) && Math.abs(currentDistY) <= tolerance && e.cancelable) {
            swipingX = true; // Horizontal swipe
            // Prevent scrolling when inside image viewport
            e.preventDefault();
        }
    });

    view.addEventListener('touchend', (e) => {
        // Only run if throttling allows
        if (!enableSwipe) return;
        enableSwipe = false;
        // To prevent error when maths operations applied:
        if (startX === null || startY === null) return;

        // Record x coordinate of touch leaving screen
        let endX = e.changedTouches[0].clientX;

        // Only run if swiping horizontally
        if (swipingX && e.cancelable) {
            // Direction of swipe returned by handleSwipe function
            let swipeDirection = handleSwipe(startX, startTime, endX);

            handleSwipeDirection(track, swipeDirection);
            // Reset x and y coordinates
            startX = null;
            startY = null;
            // Prevent click events inside image viewport
            e.preventDefault();
            // Reset swiping state to restore defaults after each swipe
            swipingX = false;
        }

        /* Only register touchend events every 600ms
           (i.e. limit user to max 2 swipes/second) */
        setTimeout(function() {
            enableSwipe = true;
        }, 600);
    });
}

/**
 * If conditions met for valid horizontal swipe, return swipe
 * direction.
 * 
 * @param {number} startX - X coordinate passed in by touchstart event listener.
 * @param {number} startTime - Time recorded by touchstart event listener.
 * @param {number} endX - X coordinate passed in by touchend event listener.
 * @returns {string} swipeDirection - Direction ('left' or 'right') determined by difference between startX and endX.
 */
function handleSwipe(startX, startTime, endX) {
    // Get distance moved horizontally
    let distX = startX - endX;
    // Minimum distance in pixels required for valid swipe
    let threshold = 100;
    // Get time since first touch
    let elapsedTime = new Date().getTime() - startTime;
    // Minimum touch duration in ms required for valid swipe
    let allowedTime = 300;
    // Direction of swipe
    let swipeDirection;

    // Only run if conditions met for valid horizontal swipe
    // if (Math.abs(distX) >= threshold && elapsedTime <= allowedTime) {
    if (Math.abs(distX) >= threshold && elapsedTime >= allowedTime) {
        /* Ternary if statement. Set direction of swipe
           if dist moved + or - */
        swipeDirection = (distX > 0) ? 'left' : 'right';
    }
    return swipeDirection;
}

/**
 * Get currently viewed slide by querying slide track.
 * 
 * If passed in swipe direction is left, get next slide in track.
 * If right, get previous slide in track.
 * 
 * Pass track, current slide & next/previous slide to moveToSlide
 * function.
 * 
 * @param {HTMLElement} track - Element containing carousel slides.
 * @param {string} swipeDirection - Direction ('left' or 'right') passed in by touchend event listener.
 */
function handleSwipeDirection(track, swipeDirection) {
    const currentSlide = track.querySelector('.current-slide');

    if (swipeDirection === 'left') {
        const nextSlide = currentSlide.nextElementSibling;
        moveToSlide(track, currentSlide, nextSlide);
    } else if (swipeDirection === 'right') {
        const prevSlide = currentSlide.previousElementSibling;
        moveToSlide(track, currentSlide, prevSlide);
    } else return; // exit function if direction undefined/falsy
}

// -------------------- Carousels functions end

// ------------------- Miscellaneous functions

// Trapping focus inside elements for keyboard navigation accessibility (e.g. modals)

/**
 * Get all focusable elements within passed in element and find
 * the first and last.
 * 
 * Listen for 'tab' or 'shift + tab' keypresses to signify keyboard
 * navigation and if the active element is first in the list on 
 * 'shift + tab' (backwards navigation), set focus to the first (and
 * vice-versa).
 *  
 * @param {HTMLElement} element - Element (modal, etc) in which focus is to be trapped
 */
function trapKeyNavFocus(element) {
    const focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
    const firstFocusableEl = focusableEls[0];  
    const lastFocusableEl = focusableEls[focusableEls.length - 1];
  
    element.addEventListener('keydown', (e) => {
        let isTabPressed = (e.key === 'Tab');
    
        if (!isTabPressed) { 
            return; 
        }
    
        if ( e.shiftKey ) {
        // Shift + Tab
            if (document.activeElement === firstFocusableEl) {
                lastFocusableEl.focus();
                e.preventDefault();
            }
        } else {
        // Tab
            if (document.activeElement === lastFocusableEl) {
                firstFocusableEl.focus();
                e.preventDefault();
            }
        }
    });
}

// Applying 'active' class to navigation links when associated page section in view

/**
 * Find link element in passed-in navigation link node list that has
 * the passed-in 'active' class, if any, and set as default 'active'
 * link.
 * 
 * Add 'scroll' event listener to window. On scroll event:
 * 
 * For each section element in passed-in section elements node list,
 * get its height and its offsetTop property (distance in pixels from
 * top of element to top of closest offset parent element, in this
 * case 'body');
 * 
 * When scrolled window's Y coordinate + height of fixed page header
 * is greater than or equal to section element's offsetTop - 1/3 of
 * section element's height, (i.e. 1/3 of section visible below header),
 * set section element's id attribute as 'current' section id;
 * 
 * Remove 'active' class from each navigation link, check its href
 * attribute for the 'current' section id (i.e  whether or not it
 * links to 'current' section) and set as 'active' link if matching.
 * If no 'current' section id (undefined), set default 'active' link
 * as 'active link;
 * 
 * Add 'active' class to 'active' link. 
 * 
 * @param {NodeList} navLinkEls - Navigation link elements that could potentially be subject to style change on scroll event.
 * @param {NodeList} LinkedSectionEls - Section elements associated with navigation links.
 * @param {string} activeClass - Class name that applies CSS styles to link elements deemed 'active'.
 */
function handleActiveLinkStyleOnScroll(navLinkEls, linkedSectionEls, activeClass) {
    let defaultActiveLink;

    for (let link of navLinkEls) {
        if (link.classList.contains(activeClass)) {
            defaultActiveLink = link;
        }
    }

    window.addEventListener('scroll', () => {
        let currentSectionId;
        let activeLink;

        for (let linkedSection of linkedSectionEls) {
            const sectionTop = linkedSection.offsetTop;
            const sectionHeight = linkedSection.clientHeight;
            // On smaller screens (width <= 768px), page header is 140px high
            if (window.innerWidth <= 768) {   
                if ((scrollY + 140) >= (sectionTop - (sectionHeight / 3))) {
                    currentSectionId = linkedSection.id
                }
            // On larger screens, page header is 207px high
            } else {
                if ((scrollY + 207) >= (sectionTop - (sectionHeight / 3))) {
                    currentSectionId = linkedSection.id
                }
            }
            
        }

        for (let link of navLinkEls) {
            if (link.classList.contains(activeClass)) {
                link.classList.remove(activeClass);
            }
            
            if (link.href.includes(`#${currentSectionId}`)) {
                activeLink = link;
            } else if (!currentSectionId){
                activeLink = defaultActiveLink;
            }
        }

        activeLink.classList.add(activeClass);
    });

}

// Throttling

/**
 * When called on an event listener's handler function, returns a
 * new event listener after a passed-in time interval, thus
 * preventing further events from firing until interval has elapsed.
 * 
 * @param {function} handler - Event handler function to be throttled.
 * @param {number} interval - Time allowed in ms between events firing. 
 * @returns {function} throttledFunction - Handler function with throttling interval applied.
 */
 function throttleEvent(handler, interval) {
    /* Boolean to control when time interval has passed.
       Set to true so that handler can be called first time. */
    let enableEvent = true;

    /* Nested function to preserve throttleEvent function's 'this'
       (execution) context and apply it to passed-in handler
       (callback) function.
       Uses rest parameter syntax (...) to pack handler's arguments
       into an array which can be read by 'apply' method. */
    return function throttledFunction(...args) {
        /* If time interval not up, exit function without calling
           handler */
        if (!enableEvent) return;
        // Prevent handler being called until interval has passed
        enableEvent = false;
        /* Apply throttling to handler and return throttled version
           with any arguments */
        handler.apply(this, args);
        // Set control flag to true after passed-in interval
        setTimeout(() => enableEvent = true, interval);
    }
}

// ----------------- Miscellaneous functions end