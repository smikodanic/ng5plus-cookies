import { Injectable } from '@angular/core';


interface CookieOptions {
  domain?: string;
  path?: string;
  expires?: number | Date; // number of days or exact date
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: string; // 'strict' for GET and POST, 'lax' only for POST
}



@Injectable()
export class CookiesService {

  private doc_avail: boolean;

  constructor() {
    // check if HTML document is available
    this.doc_avail = !!document; // true | false
  }


  /**
   * Show console error
   */
  private errNotAvailable() {
    console.error('Document is not available in Ng5PlusCookiesService.');
  }


  /**
   * Add cookie options: domain, path, expires, secure
   * @param cookieStr string
   * @param cookieOpts object
   */
  private addCookieOptions(cookieStr: string, cookieOpts?: any) {

    if (!cookieOpts) {
      return cookieStr;
    }

    // domain=example.com;
    if (!!cookieOpts.domain) {
      const cDomain = 'domain=' + cookieOpts.domain + ';';
      cookieStr += cDomain;
    }

    // path=/;
    if (!!cookieOpts.path) {
      const cPath = 'path=' + cookieOpts.path + ';';
      cookieStr += cPath;
    }

    // expires=Fri, 3 Aug 2001 20:47:11 UTC;
    if (!!cookieOpts.expires) {
      let expires;
      if (typeof cookieOpts.expires === 'number') {
        const d = new Date();
        d.setTime(d.getTime() + (cookieOpts.expires * 24 * 60 * 60 * 1000));
        expires = 'expires=' + d.toUTCString();
      } else {
        expires = cookieOpts.expires.toUTCString();
      }
      const cExpires = 'expires=' + expires + ';';

      cookieStr += cExpires;
    }

    // secure;
    if (!!cookieOpts.secure) {
      const cSecure = 'secure;';
      cookieStr += cSecure;
    }

    // HttpOnly;
    if (!!cookieOpts.httpOnly) {
      const cHttpOnly = 'HttpOnly;';
      cookieStr += cHttpOnly;
    }

    // SameSite=lax; or SameSite=strict;
    if (!!cookieOpts.sameSite) {
      const cSameSite = 'SameSite=' + cookieOpts.sameSite + ';';
      cookieStr += cSameSite;
    }


    return cookieStr;
  }



  /**
   * Set cookie. Cookie value is string.
   * @param name - cookie name
   * @param value - cookie value (string)
   * @param cookieOpts - cookie options: domain, path, expires, secure, HttpOnly, SameSite
   * @param debug - true | false (show errors and debug info)
   */
  put(name: string, value: string, cookieOpts?: CookieOptions, debug?: boolean) {

    if (!this.doc_avail) {
      if (debug) {
        this.errNotAvailable();
      }
      return;
    }

    // name=value;
    let cookieStr = name + '=' + value + ';';

    // add cookie options: domain, path, expires, secure, HttpOnly, SameSite
    cookieStr = this.addCookieOptions(cookieStr, cookieOpts);


    // put cookie
    if (debug) {
      console.log('cookie-put(): ', cookieStr);
    }
    document.cookie = cookieStr;
  }



  /**
   * Set cookie. Cookie value is object.
   * @param name - cookie name
   * @param value - cookie value (object)
   * @param cookieOpts - cookie options: domain, path, expires, secure, HttpOnly, SameSite
   * @param debug - true | false (show errors and debug info)
   */
  putObject(name: string, value: any, cookieOpts?: CookieOptions, debug?: boolean) {

    if (!this.doc_avail) {
      if (debug) {
        this.errNotAvailable();
      }
      return;
    }

    // convert object to string
    const valueStr = encodeURIComponent(JSON.stringify(value));

    // name=value;
    let cookieStr = name + '=' + valueStr + ';';

    // add cookie options: domain, path, expires, secure, HttpOnly, SameSite
    cookieStr = this.addCookieOptions(cookieStr, cookieOpts);


    // put cookie
    if (debug) {
      console.log('cookie-putObject(): ', cookieStr);
    }
    document.cookie = cookieStr;
  }



  /**
   * Get all cookies in string format (cook1=jedan1; cook2=dva2;).
   * @param debug - true | false (show errors and debug info)
   * @return string - example: cook1=jedan1; cook2=dva2;
   */
  getAll(debug?: boolean) {

    if (!this.doc_avail) {
      if (debug) {
        this.errNotAvailable();
      }
      return;
    }

    // fetch all cookies
    const allCookies = document.cookie;

    if (debug) {
      console.log('cookie-getAll(): ', allCookies);
    }
    return allCookies;
  }



  /**
   * Get cookie by specific name. Returned value is string.
   * @param name - cookie name
   * @param debug - true | false (show errors and debug info)
   * @return string
   */
  get(name: string, debug?: boolean) {

    if (!this.doc_avail) {
      if (debug) {
        this.errNotAvailable();
      }
      return;
    }

    // fetch all cookies
    const allCookies = document.cookie; // authAPIInit1=jedan1; authAPIInit2=dva2; authAPI=

    // extract cookie value for specific name
    const cookiesArr: string[] = allCookies.split(';'); // ["authAPIInit1=jedan1", " authAPIInit2=dva2", " authAPI="]
    let elemArr, elemName, elemVal, cookieVal;
    cookiesArr.forEach(function(elem: string) {
      elemArr = elem.split('='); // ["authAPIInit1", "jedan1"]
      elemName = elemArr[0].trim();
      elemVal = elemArr[1].trim();
      if (elemName === name) {
        cookieVal = elemVal;
      }
    });


    if (debug) {
      console.log('cookie-get()-cookiesArr: ', cookiesArr);
      console.log('cookie-get()-cookieVal: ', name, '=', cookieVal);
    }

    return cookieVal;
  }



  /**
   * Get cookie by specific name. Returned value is object.
   * @param name - cookie name
   * @param debug - true | false (show errors and debug info)
   * @return object
   */
  getObject(name: string, debug?: boolean) {

    if (!this.doc_avail) {
      if (debug) {
        this.errNotAvailable();
      }
      return;
    }

    let cookieVal = this.get(name, debug); // %7B%22jen%22%3A1%2C%22dva%22%3A%22dvica%22%7D

    // convert cookie string value to object
    try {
      cookieVal = JSON.parse(decodeURIComponent(cookieVal));
    } catch (err) {
      console.error('cookie-getObject(): ', err);
    }

    return cookieVal;
  }



  /**
   * Remove cookie by specific name.
   * @param name - cookie name
   * @param debug - true | false (show errors and debug info)
   * @return void
   */
  remove(name: string, debug?: boolean) {

    if (!this.doc_avail) {
      if (debug) {
        this.errNotAvailable();
      }
      return;
    }

    // set expires backward to delete cookie
    const dateOld = new Date('1970-01-01T01:00:00');

    if (debug) {
      console.log('cookie-remove(): ', name, ' cookie is deleted.');
    }
    document.cookie = name + '=;expires=' + dateOld;
  }



  /**
   * Remove all cookies.
   * @param debug - true | false (show errors and debug info)
   * @return void
   */
  removeAll(debug?: boolean) {

    if (!this.doc_avail) {
      if (debug) {
        this.errNotAvailable();
      }
      return;
    }

    // set expires backward to delete cookie
    const dateOld = new Date('1970-01-01T01:00:00');

    // fetch all cookies
    const allCookies = document.cookie; // authAPIInit1=jedan1; authAPIInit2=dva2; authAPI=

    // extract cookie value for specific name
    const cookiesArr: string[] = allCookies.split(';'); // ["authAPIInit1=jedan1", " authAPIInit2=dva2", " authAPI="]
    let elemArr, elemName;
    cookiesArr.forEach(function(elem: string) {
      elemArr = elem.split('='); // ["authAPIInit1", "jedan1"]
      elemName = elemArr[0].trim();
      document.cookie = elemName + '=;expires=' + dateOld;
    });


    if (debug) {
      console.log('cookie-removeAll(): ', cookiesArr);
    }
  }


  /**
   * Empty cookie value by specific name.
   * @param name - cookie name
   * @param debug - true | false (show errors and debug info)
   * @return void
   */
  empty(name: string, debug?: boolean) {

    if (!this.doc_avail) {
      if (debug) {
        this.errNotAvailable();
      }
      return;
    }


    if (debug) {
      console.log('cookie-empty(): ', name);
    }
    document.cookie = name + '=;';
  }


  /**
   * Check if cookie exists.
   * @param name - cookie name
   * @param debug - true | false (show errors and debug info)
   * @return boolean
   */
  exists(name: string, debug?: boolean) {

    if (!this.doc_avail) {
      if (debug) {
        this.errNotAvailable();
      }
      return;
    }

    // fetch all cookies
    const allCookies = document.cookie; // authAPIInit1=jedan1; authAPIInit2=dva2; authAPI=

    // extract cookie value for specific name
    const cookiesArr: string[] = allCookies.split(';'); // ["authAPIInit1=jedan1", " authAPIInit2=dva2", " authAPI="]
    let elemArr, elemName, cookieExists = false;
    cookiesArr.forEach(function(elem: string) {
      elemArr = elem.split('='); // ["authAPIInit1", "jedan1"]
      elemName = elemArr[0].trim();
      if (elemName === name) {
        cookieExists = true;
      }
    });

    if (debug) {
      console.log('cookie-exists(): ', cookieExists);
    }
    return cookieExists;
  }



}
