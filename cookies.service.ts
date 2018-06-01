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
    console.error('Document is not available in ng5plus-cookies.');
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
   * Get all cookies in array format.
   * @return Array
   */
  private allCookiesArr() {

    // fetch all cookies
    const allCookies = document.cookie; // authAPIInit1=jedan1; authAPIInit2=dva2; authAPI=
    
    // create cookie array
    let cookiesArr: string[] = allCookies.split(';'); // ["authAPIInit1=jedan1", " authAPIInit2=dva2", " authAPI="]

    // remove empty spaces from left and right side
    const cookiesArrMapped = cookiesArr.map(function (cookiesPair: string) { // cookiePair: " authAPIInit2=dva2"
      return cookiesPair.trim();
    });

    return cookiesArrMapped; // ["authAPIInit1=jedan1", "authAPIInit2=dva2", "authAPI="]
  }



  /**
   * Set cookie. Cookie value is string.
   * @param name - cookie name
   * @param value - cookie value (string)
   * @param cookieOpts - cookie options: domain, path, expires, secure, HttpOnly, SameSite
   * @param debug - true | false (show errors and debug info)
   */
  put(name: string, value: string, cookieOpts?: CookieOptions, debug?: boolean): void {

    if (!this.doc_avail) {
      if (debug) {
        this.errNotAvailable();
      }
      return;
    }

    // encoding cookie value
    value = encodeURIComponent(value);

    // name=value;
    let cookieStr = name + '=' + value + ';';

    // add cookie options: domain, path, expires, secure, HttpOnly, SameSite
    cookieStr = this.addCookieOptions(cookieStr, cookieOpts);

    // debug
    if (debug) {
      console.log('cookie-put():cookieStr: ', cookieStr);
    }

    // put cookie
    document.cookie = cookieStr;
  }



  /**
   * Set cookie. Cookie value is object.
   * @param name - cookie name
   * @param value - cookie value (object)
   * @param cookieOpts - cookie options: domain, path, expires, secure, HttpOnly, SameSite
   * @param debug - true | false (show errors and debug info)
   */
  putObject(name: string, value: any, cookieOpts?: CookieOptions, debug?: boolean): void {

    if (!this.doc_avail) {
      if (debug) {
        this.errNotAvailable();
      }
      return;
    }

    // convert object to string and encode that string
    const valueStr = encodeURIComponent(JSON.stringify(value));

    // name=value;
    let cookieStr = name + '=' + valueStr + ';';

    // add cookie options: domain, path, expires, secure, HttpOnly, SameSite
    cookieStr = this.addCookieOptions(cookieStr, cookieOpts);

    // debug
    if (debug) {
      console.log('cookie-putObject(): ', cookieStr);
    }

    // put cookie
    document.cookie = cookieStr;
  }



  /**
   * Get all cookies in string format (cook1=jedan1; cook2=dva2;).
   * @param debug - true | false (show errors and debug info)
   * @return string - example: cook1=jedan1; cook2=dva2;
   */
  getAll(debug?: boolean): string {

    if (!this.doc_avail) {
      if (debug) {
        this.errNotAvailable();
      }
      return;
    }

    // fetch all cookies
    const allCookies = document.cookie; // 'cook1=jedan1; cook2=dva2;'

    // debug
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
  get(name: string, debug?: boolean): string {

    if (!this.doc_avail) {
      if (debug) {
        this.errNotAvailable();
      }
      return;
    }

    // get cookies array
    const cookiesArr: string[] = this.allCookiesArr(); // ["authAPIInit1=jedan1", "authAPIInit2=dva2", "authAPI="]

    // extract cookie value for specific name
    let elemArr, cookieVal;
    cookiesArr.forEach(function(elem: string) {
      elemArr = elem.split('='); // ["authAPIInit1", "jedan1"]
      if (elemArr[0] === name) {
        cookieVal = elemArr[1];
      }
    });

    // decoding cookie value
    cookieVal = decodeURIComponent(cookieVal);

    // debug
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
  getObject(name: string, debug?: boolean): any {

    if (!this.doc_avail) {
      if (debug) {
        this.errNotAvailable();
      }
      return;
    }

    let cookieVal = this.get(name, debug); // %7B%22jen%22%3A1%2C%22dva%22%3A%22dvica%22%7D

    // convert cookie string value to object
    let cookieObj: any = null;
    try {
      if (cookieVal !== 'undefined' && !!cookieVal) {
        cookieObj = JSON.parse(decodeURIComponent(cookieVal));
      }
    } catch (err) {
      console.error('cookie-getObject(): ', err);
    }

    // debug
    if (debug) {
      console.log('cookie-getObject():cookieVal: ', cookieVal);
      console.log('cookie-getObject():cookieObj: ', cookieObj);
    }

    return cookieObj;
  }



  /**
   * Remove cookie by specific name.
   * @param name - cookie name
   * @param debug - true | false (show errors and debug info)
   * @return void
   */
  remove(name: string, debug?: boolean): void {

    if (!this.doc_avail) {
      if (debug) {
        this.errNotAvailable();
      }
      return;
    }

    // set expires backward to delete cookie
    const dateOld = new Date('1970-01-01T01:00:00');

    // debug
    if (debug) {
      console.log('cookie-remove(): ', name, ' cookie is deleted.');
    }

    // cookie removal
    document.cookie = name + '=;expires=' + dateOld;
  }



  /**
   * Remove all cookies.
   * @param debug - true | false (show errors and debug info)
   * @return void
   */
  removeAll(debug?: boolean): void {

    if (!this.doc_avail) {
      if (debug) {
        this.errNotAvailable();
      }
      return;
    }

    // set expires backward to delete cookie
    const dateOld = new Date('1970-01-01T01:00:00');

    // get cookies array
    const cookiesArr: string[] = this.allCookiesArr(); // ["authAPIInit1=jedan1", "authAPIInit2=dva2", "authAPI="]

    // extract cookie value for specific name
    let elemArr;
    cookiesArr.forEach(function(elem: string) {
      elemArr = elem.split('='); // ["authAPIInit1", "jedan1"]
      document.cookie = elemArr[0] + '=;expires=' + dateOld;
    });

    // debug
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
  empty(name: string, debug?: boolean): void {

    if (!this.doc_avail) {
      if (debug) {
        this.errNotAvailable();
      }
      return;
    }

    // empty cookie value
    document.cookie = name + '=;';

    // debug
    if (debug) {
      console.log('cookie-empty(): ', name);
    }
  }



  /**
   * Check if cookie exists.
   * @param name - cookie name
   * @param debug - true | false (show errors and debug info)
   * @return boolean
   */
  exists(name: string, debug?: boolean): boolean {

    if (!this.doc_avail) {
      if (debug) {
        this.errNotAvailable();
      }
      return;
    }

    // get cookies array
    const cookiesArr: string[] = this.allCookiesArr(); // ["authAPIInit1=jedan1", "authAPIInit2=dva2", "authAPI="]

    // extract cookie value for specific name
    let elemArr, cookieExists = false;
    cookiesArr.forEach(function(elem: string) {
      elemArr = elem.split('='); // ["authAPIInit1", "jedan1"]
      if (elemArr[0] === name) {
        cookieExists = true;
      }
    });

    // debug
    if (debug) {
      console.log('cookie-exists(): ', cookieExists);
    }

    return cookieExists;
  }



}
