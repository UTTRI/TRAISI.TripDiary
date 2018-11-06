import { ISurveyQuestion } from './survey-question-interface';

import { SurveyManagerEvents } from './survey-manager-events';
import { ISurveyPage } from './survey-page';
import * as _ from 'lodash';
import { isNullOrUndefined } from 'util';
import { SurveyConfigService } from '../shared/services/survey-config-service';

declare var $;
declare var addError: (element) => any;
declare var addSuccess: (element) => any;
declare var removeClasses: (element) => any;
declare var hasSuccess: (element) => any;
declare var displaySnackBar: (string, any, number) => any;
export default class SurveyManagerController {
	private pagesQuestions: Array<ISurveyQuestion>;

	private questions;

	// the page number currently active
	private activePageNumber: number;

	// the quest that is currently active
	private activeQuestion: any;

	private surveyPage: ISurveyPage;

	private surveyId: string;

	private _prevPageButton: JQuery;

	private _questionLabels = {};

	private _onPreviousCallbacks: Array<(activePage) => boolean>;

	private _onNextCallbacks: Array<(activePage) => boolean>;

	/**
	 *
	 * @param {angular.IScope} scope
	 * @param {angular.IScope} $rootScope
	 * @param {angular.IHttpService} $http
	 * @param {angular.IWindowService} $window
	 * @param {"angular".material.ISidenavService} $mdSideNav
	 * @param {angular.ILocationService} $location
	 * @param {"angular".translate.ITranslateService} $translate
	 * @param {SurveyConfigService} _configService
	 */
	constructor(
		private scope: ng.IScope,
		private $rootScope: ng.IScope,
		private $http: ng.IHttpService,
		private $window: ng.IWindowService,
		private $mdSideNav: ng.material.ISidenavService,
		private $location: ng.ILocationService,
		private $translate: angular.translate.ITranslateService,
		private _configService: SurveyConfigService
	) {
		this.pagesQuestions = $window['pages_questions'];

		this._onPreviousCallbacks = [];
		this._onNextCallbacks = [];

		this.questions = [];

		this.findUnregisteredQuestions();

		this.activePageNumber = 0;

		this.showQuestion(this.questions[this.activePageNumber].id);

		$window.addEventListener(SurveyManagerEvents.UPDATE_QUESTION_SUB_SECTIONS, (evt: CustomEvent) => {
			_.defer(() => {
				this.updateSubsection(evt.detail);
			});
		});
		$rootScope.$on(SurveyManagerEvents.UPDATE_QUESTION_SUB_SECTIONS, (evt, args) => {});

		this.parseActivePage();

		let pq = this.pagesQuestions[this.surveyPage.pageNumber - 1]['questions'];
		this._questionLabels = Object.assign(pq);

		this.surveyId = $window.surveyId;

		this.init();

		// window['smc'] = this;
		window['smcRootScope'] = $rootScope;
		window['smc'] = this;
	}

	/**
	 *
	 * @param questionId
	 * @param data
	 */
	private insertQuestions(questionId, data) {
		for (let p of this.pagesQuestions) {
			// console.log(p);

			for (let q of Object.keys(p['questions'])) {
				// console.log(q);

				if (parseInt(questionId.split('_')[1], 10) === parseInt(q, 10)) {
					p['questions']['test'] = 'test';
				}
			}
		}

		// console.log(data);
	}

	/**
	 *
	 * @param event
	 */
	private onInputElementSuccess = (event) => {
		for (let i = 0; i < event.detail.length; i++) {
			let inputElement: HTMLInputElement = event.detail[i];

			let questionId = inputElement.name;
			let questionValue = inputElement.value;

			if (!isNullOrUndefined(questionId) || !isNullOrUndefined(questionValue)) {
				_.defer(() => {
					this._configService.savePartialResponse(questionValue, questionId);
				});
			}
		}
	};

	/**
	 *
	 */
	private init() {
		this._prevPageButton = $('#prev-page-button');

		this.updateNavigationButtons();

		this.$window.addEventListener('InputElementSuccess', this.onInputElementSuccess);

		let url = new URL(this.$window.location.href);
		let previousPage = null;
		if (!isNullOrUndefined(url.searchParams)) {
			previousPage = url.searchParams.get('previousPage');
		}
		if (!isNullOrUndefined(previousPage)) {
			// if(previousPage > )
			this.setActivePage(this.questions.length - 1);
		}
	}

	/**
	 *
	 */
	private parseActivePage() {
		for (let page of this.pagesQuestions) {
			if (page['pageId'] === this.$window.pageId) {
				this.surveyPage = {
					pageId: <number>page['pageId'],
					pageName: page['pageName'],
					pageNumber: page['number']
				};
			}
		}
	}

	/**
	 *
	 * @param questionId
	 * @param hrefTag
	 */
	public addSubSection(questionId, hrefTag) {}

	/**
	 *
	 * @param evt
	 * @param args
	 */
	private updateSubsection(args) {
		let questionId = args[0];

		console.log('Received question id: ' + questionId);

		let questionIndex = -1;

		let totalPageCount = this.questions.length;

		this.insertQuestions(questionId, args[1]);

		for (let i = 0; i < this.questions.length; i++) {
			let parent = $('#' + args[1][0]).parents('.question-item');

			if (parent[0] === this.questions[i][0]) {
				questionIndex = i;
				break;
			}
		}

		let startingActiveIndex = this.activePageNumber;
		let adjustedQuestionIndex = questionIndex;
		if (questionIndex >= 0) {
			for (let i = 0; i < args[1].length; i++) {
				let toAdd = $('#' + args[1][i]);
				toAdd.parentQuestion = this.questions[questionIndex];
				toAdd.id = args[1][i];

				toAdd.toHide = [];
				for (let hide of args[2]) {
					let hide$ = $(hide);

					toAdd.toHide.push(hide$);
				}
				if (toAdd.length > 0) {
					if (this.questions.some((r) => r[0].id === toAdd[0].id) === false) {
						this.questions.splice(questionIndex + i + 1, 0, toAdd);
						if (adjustedQuestionIndex < startingActiveIndex) {
							this.activePageNumber++;
						}
					} else {
						this.questions.splice(questionIndex + i + 1, 1, toAdd);
						adjustedQuestionIndex++;
					}
				}
			}
		}

		this.showQuestion(this.questions[this.activePageNumber].id);
	}

	/**
	 * Reset all responses on the page
	 */
	private resetAllResponses() {
		for (let question of this.pagesQuestions) {
			question.clearResponse();
		}
	}

	/**
	 * Register a question on the active survey page
	 * @param {ISurveyQuestion} question
	 */
	private registerPageQuestion(question: ISurveyQuestion) {
		this.pagesQuestions.push(question);
	}

	private toggleMenu() {
		this.$mdSideNav('menu').toggle();
	}

	private mobileSubmit() {}

	/**
	 * Submits the "page" -> ie clicking next
	 */
	private submitForm() {
		$('form#survey_form').submit((e) => {
			$(this)
				.find('.next-container')
				.addClass('hidden');
		});
		// submit called

		$('#survey_form').submit();
	}

	/** submit the form to the server */
	private submit() {
		if (window.matchMedia('(min-width: 480px)').matches) {
			this.submitForm();
		} else {
			let question = this.questions[this.activePageNumber];
			let tripsInitialSearch = question.find('.trips-default-panel');
			let tripsInitialAndVisible = tripsInitialSearch.length > 0 && !tripsInitialSearch.hasClass('mobile-child-hide');
			let timelineAndVisible = question.hasClass('timeline-outer-container');
			// let tripsDetailsAndVisible = question.hasClass('router-outer-container');
			let tripsDetailsAndVisible = question.hasClass('router-outer-container');
			if (
				question.find('.optional-question').length > 0 ||
				question.find('.question-container').hasClass('success') ||
				question.find('.household-question').length > 0 ||
				timelineAndVisible ||
				tripsDetailsAndVisible
			) {
				this.showNextSection();
			} else {
				if (tripsInitialAndVisible) {
					displaySnackBar('Please Select an Option!', 'errorMsg', 1500);
					question
						.find('.question-container')
						.first()
						.addClass('error');
				} else if (!tripsDetailsAndVisible) {
					addError(question);
					displaySnackBar('Question incomplete or invalid!', 'errorMsg', 1500);
				}
			}

			this.$window.dispatchEvent(new CustomEvent('PAGE_SECTION_CHANGED'));
		}
	}

	/**
	 * Update the status of the navigation buttons (disabled, etc)
	 */
	private updateNavigationButtons() {
		if (this.activePageNumber > 0) {
			this._prevPageButton.removeClass('disabled');
		} else if (this.activePageNumber === 0 && this.surveyPage.pageNumber > 1) {
			this._prevPageButton.removeClass('disabled');
		} else {
			this._prevPageButton.addClass('disabled');
		}
	}

	/**
	 *
	 * @param pageNumber
	 */
	private getPageUrl(pageNumber) {
		let url = '/survey/' + this.surveyId + '/' + pageNumber;

		return url;
	}

	/**
	 *
	 */
	private previousPage() {
		this.pagesQuestions = _.sortBy(this.pagesQuestions, ['pageNumber']);

		// get the active location

		let locationHref = this.$window.location.href;
		let regex = /.+\/(\d)\//g;
		let pageNumber: number = parseInt(regex.exec(locationHref)[1], 10) - 1;

		this.$window.location.href = '/survey/' + this.surveyId + '/' + pageNumber + '?previousPage=' + (pageNumber + 1);
	}

	private previous() {
		this.showPreviousSection();
		this.$window.dispatchEvent(new CustomEvent('PAGE_SECTION_CHANGED'));
	}

	/**
	 *
	 */
	private showPreviousSection() {
		let prevReturn = true;

		for (let callback of this._onPreviousCallbacks) {
			prevReturn = callback(this.questions[this.activePageNumber]);

			if (!prevReturn) {
				break;
			}
		}

		if (prevReturn === false) {
			return;
		}

		if (this.activePageNumber > 0) {
			this.activePageNumber -= 1;
			this.showQuestion(this.questions[this.activePageNumber].id);

			window.location.hash = this.questions[this.activePageNumber].id;
		} else {
			if (this.surveyPage.pageNumber > 1) {
				this.previousPage();
			} else {
			}
		}

		this.updateNavigationButtons();
	}

	/**
	 *
	 * @param {number} pageNumber
	 */
	private setActivePage(pageNumber: number) {
		this.activePageNumber = pageNumber;

		this.showQuestion(this.questions[this.activePageNumber].id);

		this.updateNavigationButtons();

		// this.$location.search(this.questions[this.activePageNumber].id);

		// this.$window.href(this.$location.state());
		window.location.hash = this.questions[this.activePageNumber].id;
	}

	/**
	 *
	 */
	private showNextSection() {
		let nextReturn = true;

		for (let callback of this._onNextCallbacks) {
			nextReturn = callback(this.questions[this.activePageNumber]);

			if (!nextReturn) {
				break;
			}
		}

		if (nextReturn === false) {
			return;
		}

		if (this.activePageNumber < this.questions.length - 1) {
			this.setActivePage(this.activePageNumber + 1);
		} else {
			this.submitForm();
		}
	}

	/**
	 *
	 * @param {() => boolean} callback
	 */
	public addOnNext(callback: (activePage) => boolean) {
		let added = false;

		for (let callback2 of this._onNextCallbacks) {
			if (callback === callback2) {
				added = true;
				break;
			}
		}
		if (!added) {
			this._onNextCallbacks.push(callback);
		}
	}

	/**
	 *
	 * @param {() => boolean} callback
	 */
	public addOnPrevious(callback: (activePage) => boolean) {
		let added = false;

		for (let callback2 of this._onPreviousCallbacks) {
			if (callback === callback2) {
				added = true;
				break;
			}
		}
		if (!added) {
			this._onPreviousCallbacks.push(callback);
		}
	}

	/**
	 *
	 * @param {() => boolean} callback
	 */
	public unregisterOnNext(callback: () => boolean) {
		for (let i = 0; i < this._onNextCallbacks.length; i++) {
			if (this._onNextCallbacks[i] === callback) {
				this._onNextCallbacks.splice(i, 1);
			}
		}
	}

	/**
	 *
	 * @param {() => boolean} callback
	 */
	public unregisterOnPrevious(callback: () => boolean) {
		for (let i = 0; i < this._onPreviousCallbacks.length; i++) {
			if (this._onPreviousCallbacks[i] === callback) {
				this._onPreviousCallbacks.splice(i, 1);
			}
		}
	}

	/**
	 *
	 */
	private sideNavSwipeLeft() {
		this.$mdSideNav('menu').close();
	}

	/**
	 * Shows a question (for mobile) based on passed element ID
	 * @param id
	 */
	private showQuestion(id: string) {
		let activeQuestion;
		for (let question of this.questions) {
			if (question.id !== id) {
				question.removeClass('mobile-show');

				if (question.toHide !== undefined) {
					for (let hide of question.toHide) {
						hide.removeClass('mobile-child-hide');
					}

					question.addClass('mobile-child-hide');
				} else {
					question.addClass('mobile-child');
				}
			} else {
				activeQuestion = question;
			}
		}

		if (activeQuestion !== undefined) {
			activeQuestion.removeClass('mobile-hide');
			activeQuestion.removeClass('mobile-child-hide');
			activeQuestion.addClass('mobile-show');

			if (activeQuestion.toHide !== undefined) {
				for (let hide of activeQuestion.toHide) {
					hide.addClass('mobile-child-hide');
				}
			}
		}

		// this.$location.hash(id);
	}

	/**
	 *
	 */
	private findUnregisteredQuestions() {
		let questions = $('.question-item');

		for (let question of questions) {
			// this.questions[question.id] = $(question);

			let q = $(question);
			q.id = question.getAttribute('name');
			this.questions.push(q);
		}
	}
}
