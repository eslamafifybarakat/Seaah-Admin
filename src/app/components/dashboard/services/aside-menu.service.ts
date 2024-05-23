import { CheckPermissionService } from '../../../services/authentication/check-permission.service';
import { PublicService } from 'src/app/services/generic/public.service'
import { Injectable } from '@angular/core'

interface MenuItem {
  id?: string;
  text: string;
  icon: string;
  routerLink?: string;
  state: boolean;
  permission?: boolean;
  children?: MenuItem[];
}

@Injectable({
  providedIn: 'root'
})
export class AsideMenuService {

  constructor(
    private checkPermissionService: CheckPermissionService,
    private publicService: PublicService
  ) { }


  getAsideMenuItemV2(): any {
    let menuListItems: MenuItem[] = [
      {
        id: 'Statistics',
        text: this.publicService.translateTextFromJson('dashboard.sideMenu.statistics'),
        icon: `<svg width="29" height="29" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_192_85" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
<rect width="32" height="32" fill="currentColor"/>
</mask>
<g mask="url(#mask0_192_85)">
<path d="M13.6712 7.8457L14.0424 13.3656L14.2266 16.14C14.2286 16.4254 14.2733 16.7088 14.3596 16.9812C14.5821 17.51 15.1176 17.846 15.7001 17.8226L24.5764 17.2419C24.9608 17.2356 25.332 17.3794 25.6082 17.6416C25.8385 17.8602 25.9872 18.146 26.0341 18.4535L26.0498 18.6402C25.6825 23.7264 21.9469 27.9688 16.8712 29.0639C11.7954 30.159 6.59045 27.8456 4.08225 23.3798C3.35915 22.0823 2.9075 20.6563 2.75381 19.1852C2.68961 18.7498 2.66134 18.3099 2.66927 17.8699C2.66134 12.4169 6.54459 7.70253 11.9804 6.56601C12.6346 6.46413 13.276 6.81048 13.5384 7.40729C13.6062 7.5455 13.651 7.69353 13.6712 7.8457Z" fill="currentColor"/>
<path opacity="0.4" d="M29.3327 13.0829L29.3234 13.1263L29.2965 13.1895L29.3002 13.363C29.2863 13.5928 29.1975 13.8138 29.0447 13.9925C28.8854 14.1785 28.6678 14.3052 28.4282 14.3544L28.2821 14.3744L18.041 15.038C17.7003 15.0716 17.3611 14.9617 17.1079 14.7358C16.8967 14.5474 16.7618 14.2933 16.7237 14.0194L16.0363 3.79325C16.0243 3.75868 16.0243 3.7212 16.0363 3.68661C16.0457 3.40473 16.1698 3.13829 16.3809 2.94681C16.5918 2.75533 16.8723 2.65477 17.1594 2.6676C23.2393 2.82228 28.3491 7.19422 29.3327 13.0829Z" fill="currentColor"/>
</g></svg>`,
        routerLink: '/Dashboard/Statistics',
        state: false, //Opened Or Closed
        // permission: this.checkPermissionService.hasPermission('Pages.Statistics'),
        permission: true,
      },
      {
        id: 'Users',
        text: this.publicService.translateTextFromJson('dashboard.sideMenu.users'),
        icon: `
    <svg width="31" height="32" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<mask id="mask0_199_290" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="34" height="35">
<rect y="0.5" width="34" height="34" fill="url(#pattern0)"/>
</mask>
<g mask="url(#mask0_199_290)">
<rect x="-8.5" y="-8" width="51.9444" height="51" fill="currentColor"/>
</g>
<defs>
<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_199_290" transform="scale(0.00195312)"/>
</pattern>
<image id="image0_199_290" width="512" height="512" xlink:href="data:image/png;base64,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"/>
</defs>
</svg>
    `,
        routerLink: '/Dashboard/Users',
        state: false, //Opened Or Closed
        // permission: this.checkPermissionService.hasPermission('Pages.Client.List'),
        permission: true,
      },
      {
        id: 'Organizations',
        text: 'dashboard.sideMenu.organizations',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-building" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 21l18 0" />
        <path d="M9 8l1 0" />
        <path d="M9 12l1 0" />
        <path d="M9 16l1 0" />
        <path d="M14 8l1 0" />
        <path d="M14 12l1 0" />
        <path d="M14 16l1 0" />
        <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16" />
      </svg>
    `,
        // routerLink: '/Dashboard/Organizations',
        state: false, //Opened Or Closed
        permission: true,
        // permission: this.checkPermissionService.hasPermission('Pages.Sales.List'),
        children: [
          {
            text: 'dashboard.banks.banks',
            routerLink: '/Dashboard/Organizations/Banks',
            icon: '',
            state: false
          },
          {
            text: 'dashboard.schools.schools',
            routerLink: '/Dashboard/Organizations/Schools',
            icon: '',
            state: false
          },
          {
            text: 'dashboard.universities.universities',
            routerLink: '/Dashboard/Organizations/Universities',
            icon: '',
            state: false
          }
        ]
      },
      {
        id: 'Installment',
        text: 'dashboard.sideMenu.installmentWays',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-receipt-dollar" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2" />
        <path d="M14.8 8a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1" />
        <path d="M12 6v10" />
      </svg>
    `,
        routerLink: '/Dashboard/Installment-Ways',
        state: false, //Opened Or Closed
        permission: true,
        // permission: this.checkPermissionService.hasPermission('Pages.Products.List'),
      },
      {
        id: 'Kids',
        text: 'dashboard.sideMenu.kids',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-fidget-spinner" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M18 16v.01" />
        <path d="M6 16v.01" />
        <path d="M12 5v.01" />
        <path d="M12 12v.01" />
        <path d="M12 1a4 4 0 0 1 2.001 7.464l.001 .072a3.998 3.998 0 0 1 1.987 3.758l.22 .128a3.978 3.978 0 0 1 1.591 -.417l.2 -.005a4 4 0 1 1 -3.994 3.77l-.28 -.16c-.522 .25 -1.108 .39 -1.726 .39c-.619 0 -1.205 -.14 -1.728 -.391l-.279 .16l.007 .231a4 4 0 1 1 -2.212 -3.579l.222 -.129a3.998 3.998 0 0 1 1.988 -3.756l.002 -.071a4 4 0 0 1 -1.995 -3.265l-.005 -.2a4 4 0 0 1 4 -4z" />
      </svg>
    `,
        routerLink: '/Dashboard/Kids',
        state: false, //Opened Or Closed
        permission: true,
        // permission: this.checkPermissionService.hasPermission('Pages.Messages.List'),
      },
      {
        id: 'Tuition',
        text: 'dashboard.sideMenu.tuitionExpenses',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-moneybag" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M9.5 3h5a1.5 1.5 0 0 1 1.5 1.5a3.5 3.5 0 0 1 -3.5 3.5h-1a3.5 3.5 0 0 1 -3.5 -3.5a1.5 1.5 0 0 1 1.5 -1.5z" />
        <path d="M4 17v-1a8 8 0 1 1 16 0v1a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
      </svg> `,
        routerLink: '/Dashboard/Tuition-Expenses',
        state: false, //Opened Or Closed
        permission: true,
        // permission: this.checkPermissionService.hasPermission('Pages.Settings.List'),
      },
      {
        id: 'Settings',
        text: 'dashboard.sideMenu.settings',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-settings" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
      </svg>
    `,
        // routerLink: '/Dashboard/Organizations',
        state: false, //Opened Or Closed
        permission: true,
        // permission: this.checkPermissionService.hasPermission('Pages.Sales.List'),
        children: [
          {
            text: 'userInfo.my_profile',
            routerLink: '/Profile',
            icon: '',
            state: false
          },
        ]
      },
    ];

    return menuListItems;
  }

  getParentAsideMenuItem(): any {
    let menuListItems: MenuItem[] = [
      {
        id: 'Statistics',
        text: this.publicService.translateTextFromJson('dashboard.sideMenu.statistics'),
        icon: `<svg width="29" height="29" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_192_85" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
<rect width="32" height="32" fill="currentColor"/>
</mask>
<g mask="url(#mask0_192_85)">
<path d="M13.6712 7.8457L14.0424 13.3656L14.2266 16.14C14.2286 16.4254 14.2733 16.7088 14.3596 16.9812C14.5821 17.51 15.1176 17.846 15.7001 17.8226L24.5764 17.2419C24.9608 17.2356 25.332 17.3794 25.6082 17.6416C25.8385 17.8602 25.9872 18.146 26.0341 18.4535L26.0498 18.6402C25.6825 23.7264 21.9469 27.9688 16.8712 29.0639C11.7954 30.159 6.59045 27.8456 4.08225 23.3798C3.35915 22.0823 2.9075 20.6563 2.75381 19.1852C2.68961 18.7498 2.66134 18.3099 2.66927 17.8699C2.66134 12.4169 6.54459 7.70253 11.9804 6.56601C12.6346 6.46413 13.276 6.81048 13.5384 7.40729C13.6062 7.5455 13.651 7.69353 13.6712 7.8457Z" fill="currentColor"/>
<path opacity="0.4" d="M29.3327 13.0829L29.3234 13.1263L29.2965 13.1895L29.3002 13.363C29.2863 13.5928 29.1975 13.8138 29.0447 13.9925C28.8854 14.1785 28.6678 14.3052 28.4282 14.3544L28.2821 14.3744L18.041 15.038C17.7003 15.0716 17.3611 14.9617 17.1079 14.7358C16.8967 14.5474 16.7618 14.2933 16.7237 14.0194L16.0363 3.79325C16.0243 3.75868 16.0243 3.7212 16.0363 3.68661C16.0457 3.40473 16.1698 3.13829 16.3809 2.94681C16.5918 2.75533 16.8723 2.65477 17.1594 2.6676C23.2393 2.82228 28.3491 7.19422 29.3327 13.0829Z" fill="currentColor"/>
</g></svg>`,
        routerLink: '/Dashboard/Statistics',
        state: false, //Opened Or Closed
        // permission: this.checkPermissionService.hasPermission('Pages.Statistics'),
        permission: true,
      },
      {
        id: 'Kids',
        text: 'dashboard.sideMenu.kids',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-fidget-spinner" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M18 16v.01" />
        <path d="M6 16v.01" />
        <path d="M12 5v.01" />
        <path d="M12 12v.01" />
        <path d="M12 1a4 4 0 0 1 2.001 7.464l.001 .072a3.998 3.998 0 0 1 1.987 3.758l.22 .128a3.978 3.978 0 0 1 1.591 -.417l.2 -.005a4 4 0 1 1 -3.994 3.77l-.28 -.16c-.522 .25 -1.108 .39 -1.726 .39c-.619 0 -1.205 -.14 -1.728 -.391l-.279 .16l.007 .231a4 4 0 1 1 -2.212 -3.579l.222 -.129a3.998 3.998 0 0 1 1.988 -3.756l.002 -.071a4 4 0 0 1 -1.995 -3.265l-.005 -.2a4 4 0 0 1 4 -4z" />
      </svg>
    `,
        routerLink: '/Dashboard/Parent/Kids',
        state: false, //Opened Or Closed
        permission: true,
        // permission: this.checkPermissionService.hasPermission('Pages.Messages.List'),
      },
      {
        id: 'myExpenses',
        text: 'dashboard.sideMenu.myExpenses',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-currency-dollar" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 3a4 4 0 0 0 -4 4v3a4 4 0 0 0 4 4h8" />
        <path d="M16 17a4 4 0 0 0 4 -4v-3a4 4 0 0 0 -4 -4h-8" />
        <path d="M8 11h8" />
        <path d="M8 13h8" />
      </svg>`,
        routerLink: '/Dashboard/Parent/myExpenses',
        state: false, //Opened Or Closed
        permission: true,
        // permission: this.checkPermissionService.hasPermission('Pages.Messages.List'),
      }
    ];
    return menuListItems;
  }
  getBankAsideMenuItem(): any {
    let menuListItems: MenuItem[] = [{
      id: 'requests',
      text: 'dashboard.sideMenu.requests',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-currency-dollar" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 3a4 4 0 0 0 -4 4v3a4 4 0 0 0 4 4h8" />
      <path d="M16 17a4 4 0 0 0 4 -4v-3a4 4 0 0 0 -4 -4h-8" />
      <path d="M8 11h8" />
      <path d="M8 13h8" />
    </svg>`,
      routerLink: '/Dashboard/Bank/Requests',
      state: false, //Opened Or Closed
      permission: true,
      // permission: this.checkPermissionService.hasPermission('Pages.Messages.List'),
    }
    ];
    return menuListItems;
  }
  getSchoolAsideMenuItem(): any {
    let menuListItems: MenuItem[] = [
      {
        id: 'Statistics',
        text: this.publicService.translateTextFromJson('dashboard.sideMenu.statistics'),
        icon: `<svg width="29" height="29" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_192_85" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
<rect width="32" height="32" fill="currentColor"/>
</mask>
<g mask="url(#mask0_192_85)">
<path d="M13.6712 7.8457L14.0424 13.3656L14.2266 16.14C14.2286 16.4254 14.2733 16.7088 14.3596 16.9812C14.5821 17.51 15.1176 17.846 15.7001 17.8226L24.5764 17.2419C24.9608 17.2356 25.332 17.3794 25.6082 17.6416C25.8385 17.8602 25.9872 18.146 26.0341 18.4535L26.0498 18.6402C25.6825 23.7264 21.9469 27.9688 16.8712 29.0639C11.7954 30.159 6.59045 27.8456 4.08225 23.3798C3.35915 22.0823 2.9075 20.6563 2.75381 19.1852C2.68961 18.7498 2.66134 18.3099 2.66927 17.8699C2.66134 12.4169 6.54459 7.70253 11.9804 6.56601C12.6346 6.46413 13.276 6.81048 13.5384 7.40729C13.6062 7.5455 13.651 7.69353 13.6712 7.8457Z" fill="currentColor"/>
<path opacity="0.4" d="M29.3327 13.0829L29.3234 13.1263L29.2965 13.1895L29.3002 13.363C29.2863 13.5928 29.1975 13.8138 29.0447 13.9925C28.8854 14.1785 28.6678 14.3052 28.4282 14.3544L28.2821 14.3744L18.041 15.038C17.7003 15.0716 17.3611 14.9617 17.1079 14.7358C16.8967 14.5474 16.7618 14.2933 16.7237 14.0194L16.0363 3.79325C16.0243 3.75868 16.0243 3.7212 16.0363 3.68661C16.0457 3.40473 16.1698 3.13829 16.3809 2.94681C16.5918 2.75533 16.8723 2.65477 17.1594 2.6676C23.2393 2.82228 28.3491 7.19422 29.3327 13.0829Z" fill="currentColor"/>
</g></svg>`,
        routerLink: '/Dashboard/Statistics',
        state: false, //Opened Or Closed
        // permission: this.checkPermissionService.hasPermission('Pages.Statistics'),
        permission: true,
      },
      {
        id: 'KidsRequests',
        text: 'dashboard.sideMenu.KidsRequests',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-fidget-spinner" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M18 16v.01" />
        <path d="M6 16v.01" />
        <path d="M12 5v.01" />
        <path d="M12 12v.01" />
        <path d="M12 1a4 4 0 0 1 2.001 7.464l.001 .072a3.998 3.998 0 0 1 1.987 3.758l.22 .128a3.978 3.978 0 0 1 1.591 -.417l.2 -.005a4 4 0 1 1 -3.994 3.77l-.28 -.16c-.522 .25 -1.108 .39 -1.726 .39c-.619 0 -1.205 -.14 -1.728 -.391l-.279 .16l.007 .231a4 4 0 1 1 -2.212 -3.579l.222 -.129a3.998 3.998 0 0 1 1.988 -3.756l.002 -.071a4 4 0 0 1 -1.995 -3.265l-.005 -.2a4 4 0 0 1 4 -4z" />
      </svg>
    `,
        routerLink: '/Dashboard/Schools/KidsRequests',
        state: false, //Opened Or Closed
        permission: true,
        // permission: this.checkPermissionService.hasPermission('Pages.Messages.List'),
      },
      {
        id: 'KidTuitions',
        text: 'dashboard.sideMenu.Tuition',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-currency-dollar" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 3a4 4 0 0 0 -4 4v3a4 4 0 0 0 4 4h8" />
        <path d="M16 17a4 4 0 0 0 4 -4v-3a4 4 0 0 0 -4 -4h-8" />
        <path d="M8 11h8" />
        <path d="M8 13h8" />
      </svg>`,
        routerLink: '/Dashboard/Schools/Tuition',
        state: false, //Opened Or Closed
        permission: true,
        // permission: this.checkPermissionService.hasPermission('Pages.Messages.List'),
      },
      {
        id: 'tuitionExpenses',
        text: 'dashboard.sideMenu.tuitionExpenses',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-moneybag" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M9.5 3h5a1.5 1.5 0 0 1 1.5 1.5a3.5 3.5 0 0 1 -3.5 3.5h-1a3.5 3.5 0 0 1 -3.5 -3.5a1.5 1.5 0 0 1 1.5 -1.5z" />
        <path d="M4 17v-1a8 8 0 1 1 16 0v1a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
      </svg> `,
        routerLink: '/Dashboard/Schools/TuitionExpenses',
        state: false, //Opened Or Closed
        permission: true,
        // permission: this.checkPermissionService.hasPermission('Pages.Settings.List'),
      },
      {
        id: 'expenses',
        text: 'dashboard.sideMenu.expenses',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-currency-dollar" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 3a4 4 0 0 0 -4 4v3a4 4 0 0 0 4 4h8" />
        <path d="M16 17a4 4 0 0 0 4 -4v-3a4 4 0 0 0 -4 -4h-8" />
        <path d="M8 11h8" />
        <path d="M8 13h8" />
      </svg>`,
        routerLink: '/Dashboard/Schools/Expenses/List',
        state: false, //Opened Or Closed
        permission: true,
        // permission: this.checkPermissionService.hasPermission('Pages.Messages.List'),
      }
    ];
    return menuListItems;
  }
}
