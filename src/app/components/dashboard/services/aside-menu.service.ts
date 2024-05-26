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


  getAdminAsideMenuItem(): any {
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
        state: false, //Opened Or Closed
        permission: true,
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
        id: 'installmentWaysTab',
        text: 'dashboard.sideMenu.installmentWays',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-receipt-dollar" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2" />
        <path d="M14.8 8a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1" />
        <path d="M12 6v10" />
      </svg>
    `,
        routerLink: '/Dashboard/Organizations/InstallmentWays',
        state: false, //Opened Or Closed
        permission: true,
        // permission: this.checkPermissionService.hasPermission('Pages.Products.List'),
      },
    //   {
    //     id: 'Settings',
    //     text: 'dashboard.sideMenu.settings',
    //     icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-settings" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    //     <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    //     <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
    //     <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    //   </svg>
    // `,
    //     // routerLink: '/Dashboard/Organizations',
    //     state: false, //Opened Or Closed
    //     permission: true,
    //     // permission: this.checkPermissionService.hasPermission('Pages.Sales.List'),
    //     children: [
    //       {
    //         text: 'userInfo.my_profile',
    //         routerLink: '/Profile',
    //         icon: '',
    //         state: false
    //       },
    //     ]
    //   },
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
