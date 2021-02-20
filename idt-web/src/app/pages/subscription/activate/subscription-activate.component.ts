
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriberService } from './../../../../app/services/subscriber.service';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
    selector: 'idt-subscription-activate',
    templateUrl: './subscription-activate.component.html',
    styleUrls: ['./subscription-activate.component.scss']
})
export class SubscriptionActivateComponent implements OnInit, OnDestroy {

    isLoading = true;
    resultType: 'success' | 'error';

    constructor(
        private _route: ActivatedRoute,
        private _subscriberService: SubscriberService,
        private _router: Router
    ) { }

    ngOnInit(): void {
        this._route.params.subscribe((p) => {
            if (p.hash) {
                this._subscriberService.activate(p.hash).pipe(
                    finalize(() => this.isLoading = false),
                    untilDestroyed(this)
                ).subscribe((_) => {
                    this.resultType = 'success';
                }, (_) => {
                    this.resultType = 'error';
                });
            }
        });
    }

    goToDashboard() {
        this._router.navigateByUrl('/');
    }

    ngOnDestroy() { }
}
