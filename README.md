# ng5plus-cookies
> Angular 5+ cookies service.
>
> Inspired by AngularJS 1.x.x [$cookies service](https://docs.angularjs.org/api/ngCookies/service/$cookies). This service contains all those methods with some improvements.



## Installation
```bash
$ npm install --save ng5plus-cookies

```


## Integration & Implementation
```javascript
// app.module.ts
import { CookiesService } from 'ng5plus-cookies';
@NgModule({
  declarations: [],
  imports: [],
  providers: [
    CookiesService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


//some.component.ts
private cookieOpts;

constructor(private cookiesService: CookiesService) {

   	this.cookieOpts = {
   		domain: 'example.com',
   		path: '/',
   		// expires: 5, // expires after 5 days
   		expires: new Date('2018-10-31T03:24:00'),
   		secure: false,
   		httpOnly: false,
   		sameSite: 'strict'
 	};
}

login() {
	this.cookiesService.putObject('authAPI', cookie_val, this.cookieOpts, false);
}

```



## Cookie Options
```javascript
interface CookieOptions {
  domain?: string;
  path?: string;
  expires?: number | Date; // number of days or exact date
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: string; // 'strict' for GET and POST, 'lax' only for POST
}

```
*domain* - [string] cookie domain

*path* - [string] specific cookie path

*expires* - [number | Date] define cookie expiration time (in days or exact day/time)

*secure* - [boolean] Cookie to only be transmitted over secure protocol as https.

*httpOnly* - [boolean] additional flag

*sameSite* - ['strict' | 'lax'] prevents the browser from sending this cookie along with cross-site requests, 'strict' for POST and GET, 'lax' only for POST




## Methods
#### put(name: string, value: string, cookieOpts?: CookieOptions, debug?: boolean) : void
Set cookie. Cookie value is string.

#### putObject(name: string, value: any, cookieOpts?: CookieOptions, debug?: boolean) : void
Set cookie. Cookie value is object.

#### getAll(debug?: boolean) : string
Get all cookies in string format. For example: 'cook1=jedan1; cook2=dva2;'.

#### get(name: string, debug?: boolean) : string
Get cookie by specific name. Returned value is string.

#### getObject(name: string, debug?: boolean) : any
Get cookie by specific name. Returned value is object.

#### remove(name: string, debug?: boolean) : void
Remove cookie by specific name.

#### removeAll(debug?: boolean) : void
Remove all cookies.

#### empty(name: string, debug?: boolean) : void
Empty cookie value by specific name.

#### exists(name: string, debug?: boolean) : boolean
Check if cookie exists.




## Licence
Created by [Saša Mikodanić](http://www.mikosoft.info) under MIT licence.
