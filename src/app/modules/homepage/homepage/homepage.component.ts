import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, ElementRef, Input, NO_ERRORS_SCHEMA, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalConfig, NgbModalRef, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'src/app/api.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { ConfirmationDialogComponent } from '../../admin-lte/mat-design/confirmation-dialog/confirmation-dialog.component';
import { untilDestroyed } from '@ngneat/until-destroy';
import { delay, filter, timeInterval } from 'rxjs';
import { NgForm } from '@angular/forms';
import { UpdatePasswordComponent } from 'src/app/user-auth/update-password/update-password.component';
import { SharedService } from 'src/app/service/shared.service';
import { SettingComponent } from '../setting/setting.component';
import { NewsService } from 'src/app/service/news.service';
import { ContextMenuComponent } from 'src/app/module/context-menu/context-menu.component';
import { HttpClient } from '@angular/common/http';

interface Item {
  value: string;
  text: string;
}

interface JsonData {
  [key: string]: Item[];
}

declare function ConnectToServer(): any;
declare function RequestStory(strStoryId: any): any;
declare function searchListPanel(data: any): any;
declare function RequestNews(strNewsWire: string, symbol: string, TestElement: string): any;
declare function RequestSearchNews(strNewsWire: string, symbol: string, TestElement: string, requestedBy: boolean): any;
declare function SerchNewsImage(tableName: string): any;
declare function clearTableRows(tableName: any): any;
declare function searchMenuList(): any;
declare function heartBeat(msg: any): any;
declare function RequestSearchNewsOnFly(strNewsWire: string, symbol: string, TestElement: string, requestedBy: boolean): any;
declare function Authenticate(user_id: any, accessToken: string): any;
declare function getCompaniesName(access_token: any, searchText: string): any;
declare var informistHub: any;
declare var $: any;
declare var activatedLayout: any;
declare var MainPermission: any;


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],

})
export class HomepageComponent implements OnInit {
  @ViewChild('contextMenu', { static: false }) contextMenu: ContextMenuComponent | undefined;
  private contextMenuEvent: MouseEvent | undefined;
  selectedOptions: { [key: string]: { [key: string]: boolean } } = {
    'newsTable': {},
    'newsTable2': {}
  };
  selectedTopics: string[] = [];
  topicOptions: { value: string, label: string }[] = [
    { value: 'Option 1', label: 'Option 1' },
    { value: 'Option 2', label: 'Option 2' },
    { value: 'Option 3', label: 'Option 3' }
  ];
  private modalReference: NgbModalRef | null;
  isMenuOpen = false;
  showDateFilter: boolean = false;
  isSubmenuOpen = false;
  searchTable: string = 'searchTable';
  filteredForm: string = 'filteredForm';
  private modalRef: NgbModalRef | undefined;
  isSidebarOpen: boolean = false;
  searchListId: string = 'SearchList';
  combinedSymbolsData: any;
  isSocketDisconnected: boolean = false;
  errorMessage: string = '';
  dateOption: string = 'between';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  @Input() userId: string | null = null;
  isLoginPage: boolean = true;
  newsData: any[] = [];
  selectedNews: {
    dateTime: string;
    headline: string;
    description: string;
    category: string;
    notes: string;
    categoryCode: string;
  } | null = null;

  userData: any;
  isUserLoggedIn: boolean = false;
  isdashboard: boolean = true;

  chip: any;
  closeResult = '';
  activatedTable: any;
  isRealLoginPage: boolean = true;
  isSubscribePage: boolean = true;
  isHomePage: boolean = true;
  user_id: string = '';
  wire: string = '';
  category: string = '';
  news_from_date: string = '';
  news_to_date: string = '';
  keyword_search: string = '';
  SearchIn: string = '';
  mainwire: string = '';
  countriestext: string = '';
  topicstext: string = '';
  symbolcategory: string = '';
  companySymbol: string = '';
  notificationData: any;
  isToastVisible: boolean = false;
  notification: any;
  notificationCount: any;
  connectionToken: string = '';
  currentIndex = 0;
  symbolCondition: any = 'AND';
  topicCondition: any = 'AND';
  latestNewsStoryContent: string = '';
  responseData: any[] = [];
  permittedwires: any;
  subscribeResponseData: any[] = [];
  subscribepaidResponseData: any[] = [];
  subscribetrialResponseData: any[] = [];
  trialsubscription_until: string = '';
  trialtotal_amt: number = 0;
  trialsubscription_type: string = '';
  paidsubscription_until: string = 'dd/mm/yyyy';
  paidtotal_amt: number = 0;
  paidsubscription_type: string = 'Paid';
  subscriptionData: any;
  subscriptionError: string = '';
  cartEmpty: boolean = false;
  old_password: any = '';
  new_password: any = '';
  confirm_password: any = '';
  symbolsCategories: string[] = [];
  topicsCategories: string[] = [];
  countriesCategories: string[] = [];
  newNewsCategory: string = '';
  symbolstext: string = '';
  symbolCategory: string = '';
  countiesCategory: string = '';
  sharedService: any;
  companies: any;
  allwires: string = '@CEW@CMW@CTEST';
  signUpData = {
    old_password: '',
    new_password: '',
    confirm_password: '',
  };
  wirePermission: any[] = [];
  message: string = '';
  jsonData: JsonData = {};
  firstOperator: string = '';
  opratorValue: string = '';
  firstOperatorTopic: string = '';
  constructor(private router: Router,
    private authService: AuthenticationService,
    private productService: ProductService,
    private dialog: MatDialog,
    private newsService: NewsService,
    private renderer: Renderer2,
    private NgbOffcanvas: NgbOffcanvas,
    private http: HttpClient,
    private el: ElementRef,
    private observer: BreakpointObserver,
    public sharedservice: SharedService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private cd: ChangeDetectorRef) {
    const currentDate = new Date();
    this.news_to_date = currentDate.toISOString().split('T')[0];
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    this.news_from_date = threeMonthsAgo.toISOString().split('T')[0];
    config.backdrop = 'static';
    config.keyboard = false;
    this.modalReference = null;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url;
        this.isRealLoginPage = url.endsWith('/login') || url.endsWith('signup');
        this.isLoginPage = url.endsWith('/');
        this.isdashboard = url.endsWith('/');
        this.isHomePage = url.endsWith('/index');
        this.isSubscribePage =
          url.endsWith('/') ||
          url.endsWith('/login') ||
          url.endsWith('forgot-password') ||
          url.endsWith('reset-password');
        this.isUserLoggedIn = this.authService.isUserLoggedIn();
      }
    });


  }
  permittedWiresString: any;
  toggleValue: boolean = false;



  ngOnInit(): void {
    setTimeout(() => {
      heartBeat('Heartbeat' + new Date());
      console.log('Heartbeat' + new Date());
    }, 10000);

    this.loadCompanies();

    this.productService.getNotification().subscribe(
      (response) => {
        const notificationDataString = JSON.stringify(response.data);
        localStorage.setItem('notificationData', notificationDataString);
      }
    );
    this.productService.subscriptionList().subscribe(
      (subscriptionResponse) => {
        if (subscriptionResponse.code === 200) {
          this.subscribeResponseData = subscriptionResponse.data.response;
          if (subscriptionResponse.data.response.length === 0) {
            window.location.href = 'free-trial-select-wire';
            localStorage.setItem('subscription_type', 'TRIAL');
          } else {

            localStorage.setItem('subscription_type', 'PAID');
          }
        }
      },
      (error) => {
        window.location.href = 'free-trial-select-wire';
      }
    );





    if (this.authService.isUserLoggedIn()) {
      const notificationDataString = localStorage.getItem('notificationData');
      const notificationCountString = localStorage.getItem('notificationCount');

      if (notificationDataString) {
        this.notificationData = JSON.parse(notificationDataString);
      }

      if (notificationCountString) {
        this.notificationCount = parseInt(notificationCountString, 10);
      }
      this.isUserLoggedIn = true;
    } else {
      window.location.href = 'login';
    }
    this.sharedservice.selectTheme();
  }

  private createNewsRow(newsData: any): HTMLElement {
    const newRow = this.renderer.createElement('tr');
    const cell1 = this.renderer.createElement('td');
    const cell2 = this.renderer.createElement('td');

    this.renderer.appendChild(cell1, this.renderer.createText(newsData.storydate));
    this.renderer.appendChild(cell2, this.renderer.createText(newsData.headline));

    this.renderer.appendChild(newRow, cell1);
    this.renderer.appendChild(newRow, cell2);

    return newRow;
  }

  toggleAccordion(event: Event) {
    const accordionHeader = event.currentTarget as HTMLElement;
    accordionHeader.classList.toggle('active');
    const accordionContent = accordionHeader.nextElementSibling as HTMLElement;
    accordionContent.style.display = accordionContent.style.display === 'block' ? 'none' : 'block';
  }

  logout() {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, {
      size: 'md', centered: true
    });
    modalRef.componentInstance.message = 'Do you want to logout..?';

    modalRef.result.then((result) => {
      if (result === true) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  RequestStory(storyno: any) {
    this.RequestStory(storyno);
  }

  open() {
    this.modalService.open(SettingComponent, { ariaLabelledBy: 'modal-basic-title', size: 'md' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }


  profileOpen(profile: any) {
    this.productService.userProfile().subscribe(
      (response) => {
        if (response.error == 1) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        this.userData = response.data;
      }
    );

    this.modalService.open(profile, { ariaLabelledBy: 'modal-basic-title', size: 'xl', centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }


  openOffCanva(topOffCanvas: any) {
    this.modalRef = this.modalService.open(topOffCanvas, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      scrollable: true
    });

    this.modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  onCloseButtonClick(searchTable: any) {
    RequestSearchNews("", "", searchTable, false);
    if (this.modalRef) {
      this.modalRef.close('Cross click');
    }
  }

  EditProfileOpen(profileEdit: any) {
    this.productService.userProfile().subscribe(
      (response) => {
        if (response.error == 1) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        this.userData = response.data;
      }
    );

    this.modalService.open(profileEdit, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  subscriptionOpen(subscription: any) {

    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach((header) => {
      header.addEventListener('click', () => {
        header.classList.toggle('active');
        const accordionContent = header.nextElementSibling as HTMLElement;

        if (accordionContent.style.display === 'block') {
          accordionContent.style.display = 'none';
        } else {
          accordionContent.style.display = 'block';
        }
      });
    });
    this.modalService.open(subscription, { ariaLabelledBy: 'modal-basic-title', scrollable: true, size: 'xl', }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



  ngAfterViewInit() {
    $('.sd-CustomSelect').multipleSelect({
      selectAll: false,
      onOptgroupClick: function (view: any) {
        $(view).parents("label").addClass("selected-optgroup");
      }
    });


    function formatDateTime(dateTimeString: string) {
      const options = { hour: '2-digit', minute: '2-digit', hour12: true } as Intl.DateTimeFormatOptions;
      return new Date(dateTimeString).toLocaleTimeString(undefined, options);
    }
    const dateCells = document.querySelectorAll('.table tbody tr td:first-child');
    dateCells.forEach((cell) => {
      const originalDateTime = cell.textContent!;
      const formattedDateTime = formatDateTime(originalDateTime);
      cell.textContent = formattedDateTime;
      cell.setAttribute('title', originalDateTime);
    });


    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1), untilDestroyed(this))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });

    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e: any) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }

  onSaveChanges(form: NgForm,) {
    if (form.valid) {
      const formData = {
        user_id: this.user_id,
        mobile_no: form.value['mobile-number'] || 0,
        email_id: form.value.email || 'string',
        status: 'ACTIVE',
        fname: form.value.fname || 'string',
        lname: form.value.lname || 'string',
        city: form.value.city || 'string',
        country_id: form.value['country_id'] || 0
      };

      this.productService.updateProfile(formData).subscribe(
        (response) => {
          if (response.code === 200 && this.modalReference) {
            this.modalReference.close();
          }
        }
      );
    }
  }

  changePasswordOpen() {
    this.modalService.open(UpdatePasswordComponent, { ariaLabelledBy: 'modal-basic-title', scrollable: false, size: 'md', }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  toggleSubmenu(event: Event) {
    event.preventDefault();
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

  signUp(signUpForm: NgForm) {
    this.errorMessage = '';
    if (signUpForm.value.mobile_no == '' && signUpForm.value.email_id == '' && signUpForm.value.password == '') {
      this.errorMessage = 'Please fill all details..!!';
    }
  }

  loadNewsDetails(storyno: any) {
    RequestStory(storyno);
  }


  toggleMenuOpen() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  reloadPage() {
    const currentRouteUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRouteUrl]);
    });
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  openContextMenu(event: MouseEvent) {
    event.preventDefault();
    // this.ContextMenuService.triggerContextMenu(event);
  }


  // onSearchNews(searchForm: NgForm): void {
  //   let keyword_search = searchForm.value.keyword_search;
  //   const categoryValue = searchForm.value.category || "";
  //   const companySymbolValue = searchForm.value.companySymbol;
  //   const SearchIn = searchForm.value.SearchIn;
  //   let symbolCategories = this.symbolsCategories;
  //   let topicsCategories = this.topicsCategories;

  //   console.log('Wire Value:', keyword_search);
  //   console.log('Symbols Categories:', symbolCategories);
  //   console.log('Topics Categories:', topicsCategories);
  //   console.log('Search in:', SearchIn);

  //   keyword_search = SearchIn + ":" + keyword_search;
  //   if (symbolCategories || topicsCategories) {
  //     keyword_search += symbolCategories ? ' ' + symbolCategories : '';
  //     keyword_search += topicsCategories ? ' ' + topicsCategories : '';
  //   }

  //   if (keyword_search.includes('+')) {
  //     keyword_search = keyword_search.replace(/\+/g, 'AND ');
  //   }

  //   if (keyword_search.includes('-')) {
  //     keyword_search = keyword_search.replace(/-/g, 'NOT ');
  //   }

  //   if (keyword_search.includes('_')) {
  //     keyword_search = keyword_search.replace(/_/g, 'OR ');
  //   }

  //   console.log(keyword_search.replace(/,/g, ' '));


  //   // if (keyword_search || categoryValue || companySymbolValue) {
  //   //   this.errorMessage = '';
  //   //   // RequestSearchNews('@CEW@CMW@CTEST', keyword_search, this.searchTable, true);
  //   //   // You can uncomment and modify the above line based on your requirements
  //   // } else {
  //   //   this.errorMessage = 'Please specify your request by typing it out.';
  //   // }
  // }

  onSearchNews(searchForm: NgForm): void {
    let keyword_search = searchForm.value.keyword_search;
    const categoryValue = searchForm.value.category || "";
    const companySymbolValue = searchForm.value.companySymbol;
    const SearchIn = searchForm.value.SearchIn;
    let symbolCategories: string | string[] = this.symbolsCategories;
    let topicCategories: string | string[] = this.topicsCategories;
    const dateOption = searchForm.value.dateOption;

    if (keyword_search || keyword_search != '') {
      if (SearchIn === '' || SearchIn === null) {
        this.errorMessage = 'Select the field you want to search';
      } else {
        symbolCategories = typeof symbolCategories === 'string' ? [symbolCategories] : symbolCategories;
        topicCategories = typeof topicCategories === 'string' ? [topicCategories] : topicCategories;

        let combinedSymbols: string[] = [];
        let combinedTopics: string[] = [];


        if (Array.isArray(symbolCategories) && symbolCategories.length > 0) {
          const firstSymbol = symbolCategories[0].replace(/^[+\-_]/, (match) => {
            this.firstOperator = match;
            return '';
          });

          combinedSymbols.push(`@${firstSymbol}`);
          combinedSymbols.push(...symbolCategories.slice(1).map(item => item.includes('+') ? `AND @${item.replace('+', '')}` : (item.includes('-') ? `NOT @${item.replace('-', '')}` : `OR @${item.replace('_', '')}`)));
        }

        // For topicCategories
        if (Array.isArray(topicCategories) && topicCategories.length > 0) {
          const topicsWithSlash = topicCategories.filter(item => item.includes('/'));
          const otherTopics = topicCategories.filter(item => !item.includes('/'));



          if (otherTopics.length > 0) {
            const firstTopicWithoutSlash = otherTopics[0].replace(/[+\-_]/g, '');
            this.firstOperatorTopic = otherTopics[0].match(/^[+\-_]/)?.[0] || '';

            if (this.firstOperatorTopic === '+') {
              this.opratorValue = ' AND ';
            } else if (this.firstOperatorTopic === '-') {
              this.opratorValue = ' NOT ';
            } else {
              this.opratorValue = ' OR ';
            }

            const processedHeadline = combinedTopics.concat(firstTopicWithoutSlash).join(' ').replace(/\+/g, 'AND').replace(/-/g, 'NOT').replace(/_/g, 'OR');
            keyword_search = SearchIn + ':' + `(${keyword_search} ${this.opratorValue} ${processedHeadline})`;



            for (let i = 1; i < otherTopics.length; i++) {
              const processedOtherHeadline = otherTopics[i].replace(/\+/g, ' AND ').replace(/-/g, ' NOT ').replace(/_/g, ' OR ');
              keyword_search += processedOtherHeadline;
            }
          }


          if (topicsWithSlash.length > 0) {
            const firstTopicWithSlash = topicsWithSlash[0].replace(/[+\-_]/g, '');
            this.firstOperatorTopic = topicsWithSlash[0].match(/^[+\-_]/)?.[0] || '';
            if (this.firstOperatorTopic === '+') {
              this.opratorValue = 'AND';
            } else if (this.firstOperatorTopic === '-') {
              this.opratorValue = 'NOT';
            } else {
              this.opratorValue = 'OR';
            }

            const processedCategory = firstTopicWithSlash.replace(/\+/g, ' AND ').replace(/-/g, ' NOT ').replace(/_/g, ' OR ');
            keyword_search = keyword_search + ' ' + this.opratorValue + ' ' + `category:${processedCategory} `;
          

            
            for (let i = 1; i < topicsWithSlash.length; i++) {
              const processedOtherHeadline = topicsWithSlash[i].replace(/\+/g, ' AND ').replace(/-/g, ' NOT ').replace(/_/g, ' OR ');
              keyword_search += processedOtherHeadline;
            }
          
          
          }


        }




        if (this.firstOperator === '+') {
          this.opratorValue = 'AND';
        } else if (this.firstOperator === '-') {
          this.opratorValue = 'NOT';
        } else {
          this.opratorValue = 'OR';
        }


        if (symbolCategories.length > 0) {
          this.combinedSymbolsData = this.opratorValue + ' (companysymbol:' + combinedSymbols.join(' ') + ')';

        } else {
          this.combinedSymbolsData = '';
        }

        if (this.dateOption === 'from') {
          keyword_search = keyword_search + ' ' + this.combinedSymbolsData + ' AND storydate:%5B' + this.news_from_date + ' TO *%5D';
        } else if (this.dateOption === 'to') {
          keyword_search = keyword_search + ' ' + this.combinedSymbolsData + ' AND storydate:%5B* TO ' + this.news_to_date + '%5D';
        } else if (this.dateOption === 'between') {
          keyword_search = keyword_search + ' ' + this.combinedSymbolsData + ' AND storydate:[' + this.news_from_date + ' TO ' + this.news_to_date + ']';
        } else {
          keyword_search = keyword_search;
        }
      }
    } else {

      symbolCategories = typeof symbolCategories === 'string' ? [symbolCategories] : symbolCategories;
      topicCategories = typeof topicCategories === 'string' ? [topicCategories] : topicCategories;

      let combinedSymbols: string[] = [];
      let combinedTopics: string[] = [];

      if (Array.isArray(symbolCategories) && symbolCategories.length > 0) {
        const firstSymbol = symbolCategories[0].replace(/[+\-_]/g, '');
        combinedSymbols.push(`@${firstSymbol}`);
        combinedSymbols.push(...symbolCategories.slice(1).map(item => item.includes('+') ? `AND @${item.replace('+', '')}` : (item.includes('-') ? `NOT @${item.replace('-', '')}` : `OR @${item.replace('_', '')}`)));
      }

      if (Array.isArray(topicCategories) && topicCategories.length > 0) {
        const topicsWithSlash = topicCategories.filter(item => item.includes('/'));
        const otherTopics = topicCategories.filter(item => !item.includes('/'));

        if (topicsWithSlash.length > 0) {
          const firstTopicWithSlash = topicsWithSlash[0].replace(/[+\-_]/g, '');
          this.firstOperatorTopic = topicsWithSlash[0].match(/^[+\-_]/)?.[0] || '';
          const processedCategory = firstTopicWithSlash.replace(/\+/g, ' AND ').replace(/-/g, ' NOT ').replace(/_/g, ' OR ');
          keyword_search = `category:${processedCategory} `;
        }

        if (otherTopics.length > 0) {
          const firstTopicWithoutSlash = otherTopics[0].replace(/[+\-_]/g, '');
          this.firstOperatorTopic = otherTopics[0].match(/^[+\-_]/)?.[0] || '';
          const processedHeadline = combinedTopics.concat(firstTopicWithoutSlash).join(' ').replace(/\+/g, 'AND').replace(/-/g, 'NOT').replace(/_/g, 'OR');

          keyword_search += otherTopics.length > 1
            ? `(headline:${processedHeadline}`
            : `headline:${processedHeadline}`;

          for (let i = 1; i < otherTopics.length; i++) {
            const processedOtherHeadline = otherTopics[i].replace(/\+/g, ' AND ').replace(/-/g, ' NOT ').replace(/_/g, ' OR ');
            keyword_search += ` ${processedOtherHeadline}`;
          }

          keyword_search += otherTopics.length > 1 ? ')' : '';
        }
      }




      if (combinedSymbols.length > 0) {
        keyword_search = '(companysymbol:' + combinedSymbols.join(' ') + ') ';
      }

      console.log(keyword_search);



    }


    if (keyword_search || categoryValue || companySymbolValue) {
      this.errorMessage = '';
      RequestSearchNewsOnFly(this.allwires, keyword_search, this.searchTable, true);
      // You can uncomment and modify the above line based on your requirements
    } else {
      this.errorMessage = 'Please specify your request by typing it out.';
    }
  }






  onFilteredNews(filteredForm: NgForm) {
    const selectedWire = this.mainwire;
    const categoryValue = this.category;
    console.log(filteredForm.value);
    if (categoryValue || selectedWire) {
      this.errorMessage = '';
      RequestSearchNews(`@${selectedWire}`, categoryValue, this.activatedTable, true);
    } else {
      RequestSearchNews(``, categoryValue, this.activatedTable, true);
    }
  }

  downloadCSV() {
    const table = document.getElementById("newsTable");
    if (!table) {
      console.error("Table not found.");
      return;
    }
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    if (!rows.length) {
      console.warn("No data to export.");
      return;
    }
    const csv = [];
    for (const row of rows) {
      const rowData = [];
      const cells = Array.from(row.querySelectorAll("td"));
      for (const cell of cells) {
        rowData.push(cell.textContent);
      }
      csv.push(rowData.join(","));
    }
    const csvContent = csv.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsData.csv";
    a.click();
  }

  showContextMenu(event: MouseEvent) {

    event.preventDefault();

    if (this.contextMenu) {
      this.contextMenu.positionX = event.clientX;
      this.contextMenu.positionY = event.clientY;
      this.contextMenu.display = 'block';
      this.contextMenuEvent = event;
    }
  }

  // handleMenuItemClick(action: string) {
  //   console.log('CLick');
  //   if (this.contextMenu) {
  //     this.contextMenu.display = 'none'; // Hide the context menu
  //   }
  // }



  apply(tableName: string) {
    const selectedWires = this.selectedOptions[tableName];
    const selectedWireNames = Object.keys(selectedWires).filter(option => selectedWires[option]);
    const formattedWireNames = selectedWireNames.map(wire => `@${wire}`).join(',');
  }


  clearTableRows(tableName: any) {
    clearTableRows(tableName);
    this.errorMessage = '';
  }

  onHeadlineChange(selectedValue: string) {
    this.category = '';
    this.mainwire = selectedValue;
    let menuFileName: string = selectedValue + '-Menu.json';

    if (menuFileName) {
      this.http.get(`assets / json / ${menuFileName}`).subscribe(
        (data: any) => {
          this.jsonData = data;
          this.resetAndAddSelectElements();
        },
        (error) => {
          console.error("Error loading menu file:", error);
          this.resetSelectElements();
        }
      );
    }
  }

  resetAndAddSelectElements() {
    const existingSelectElements = document.querySelectorAll('.new-select');
    existingSelectElements.forEach((element) => {
      element.remove();
    });
    const container = document.querySelector('.main-filter-panel');
    if (container) {
      const children = Array.from(container.children);
      const referenceElement = children[children.length - 2];
      for (const label in this.jsonData) {
        if (this.jsonData.hasOwnProperty(label)) {
          const colDiv = document.createElement('div');
          colDiv.className = 'col-md-2 new-select my-2';

          const formGroupDiv = document.createElement('div');
          formGroupDiv.className = 'form-group';

          const selectElement = document.createElement('select');
          selectElement.className = 'form-select search-control search-select';
          selectElement.name = label;
          selectElement.id = label;
          selectElement.required = true;

          selectElement.addEventListener('change', (event) => {
            const target = event.target as HTMLSelectElement;
            const selectedValue = target.value;
            if (selectedValue) {
              this.onCategoryChange(selectedValue);
            }
          });

          const optgroup = document.createElement('optgroup');
          optgroup.label = label;
          const defaultOption = document.createElement('option');
          defaultOption.value = '';
          defaultOption.text = `${label}`;
          defaultOption.setAttribute('disabled', 'disabled');
          defaultOption.setAttribute('selected', 'selected');
          optgroup.appendChild(defaultOption);

          this.jsonData[label].forEach((item: Item) => {
            const option = document.createElement('option');
            option.value = item.text;
            option.text = item.value;
            optgroup.appendChild(option);
          });

          selectElement.appendChild(optgroup);
          formGroupDiv.appendChild(selectElement);
          colDiv.appendChild(formGroupDiv);
          container.insertBefore(colDiv, referenceElement);
        }
      }
    } else {
      console.error('.container element not found.');
    }

  }

  resetSelectElements() {
    const existingSelectElements = document.querySelectorAll('.new-select');
    existingSelectElements.forEach((element) => {
      element.remove();
    });
  }


  onCategoryChange(selectedValue: string) {
    this.category = selectedValue;
  }

  ReconnectConnection() {
    ConnectToServer();
  }

  onToggleLayout() {
    if (this.toggleValue = !this.toggleValue) {
      console.log('Layout2');
    } else {
      console.log('Layout1');
    }
  }


  handleChips(chipType: string, chipValue: string): void {
    let targetArray: string[] = [];
    let condition: string = '';
    let conditionValue: string = '';

    switch (chipType) {
      case 'symbol':
        targetArray = this.symbolsCategories;
        condition = this.symbolCondition;
        break;
      case 'topic':
        targetArray = this.topicsCategories;
        condition = this.topicCondition;
        break;
      case 'country':
        targetArray = this.countriesCategories;
        break;
    }

    if (condition == 'AND') {
      conditionValue = '+';
    } else if (condition == 'NOT') {
      conditionValue = '-';
    } else {
      conditionValue = '_';
    }

    const chipWithSameName = targetArray.find(chip => chip.substring(1) === chipValue);

    if (!chipWithSameName) {
      const index = targetArray.indexOf(conditionValue + chipValue);

      if (index === -1) {
        targetArray.push(conditionValue + chipValue);
      } else {
        // If the chip with the same name but different conditionValue exists, remove it
        if (targetArray[index] !== conditionValue + chipValue) {
          targetArray.splice(index, 1);
        }
      }
    }
  }



  addNewsCategory(categoryType: string): void {
    let newCategory: string = '';

    switch (categoryType) {
      case 'symbol':
        newCategory = this.symbolcategory.trim();
        break;
      case 'topic':
        newCategory = this.newNewsCategory.trim();
        break;
      case 'country':
        newCategory = this.countiesCategory.trim();
        break;
    }

    if (newCategory === '') {
      return;
    }

    if (categoryType === 'topic' && this.topicsCategories.includes(newCategory)) {
      // this.errorMessage = 'Category already added.';
      return;
    } else {
      this.errorMessage = '';
    }

    this.handleChips(categoryType, newCategory);

    // Clear input based on category type
    switch (categoryType) {
      case 'symbol':
        this.symbolcategory = '';
        break;
      case 'topic':
        this.newNewsCategory = '';
        break;
      case 'country':
        this.countiesCategory = '';
        break;
      // Add more cases if needed
    }
  }
  removeNewsCategory(categoryType: string, index: number): void {
    switch (categoryType) {
      case 'symbol':
        this.symbolsCategories.splice(index, 1);
        break;
      case 'topic':
        this.topicsCategories.splice(index, 1);
        break;
      case 'country':
        this.countriesCategories.splice(index, 1);
        break;
    }

    // Clear input based on category type
    switch (categoryType) {
      case 'symbol':
        this.symbolcategory = '';
        break;
      case 'topic':
        this.newNewsCategory = '';
        break;
      case 'country':
        this.countiesCategory = '';
        break;
      // Add more cases if needed
    }
  }



  // Add similar functions for topics and countries
  removeTopic(index: number): void {
    this.removeNewsCategory('topic', index);
  }

  removeCountry(index: number): void {
    this.removeNewsCategory('country', index);
  }


  onDateOptionChange() {
    // Add your logic here if needed
    // console.log('Date option changed:', this.dateOption);
  }

  toggleDateFilter(): void {
    this.showDateFilter = !this.showDateFilter;
  }

  onTopicConitionChange(selectedValue: string) {
    this.topicCondition = selectedValue;
  }
  onSymbolConitionChange(selectedValue: string) {
    this.symbolCondition = selectedValue;
  }

  loadCompanies() {
    this.productService.getCompanies().subscribe((data: any) => {
      this.companies = data;
    });
  }

  onSearchChange() {
    const authToken = this.authService.getToken();
    if (this.symbolcategory && this.symbolcategory.length >= 3) {
      getCompaniesName(authToken, this.symbolcategory);
    }
  }

  searchMenu() {
    searchMenuList();
  }


  onSelectChange(event: any): void {
    searchListPanel(event.target.value);
    this.allwires = event.target.value;
  }
}


