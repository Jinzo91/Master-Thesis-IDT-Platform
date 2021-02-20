import { Component, Input, ViewEncapsulation} from '@angular/core';

export interface CarouselSlide {
    index: string;
    title: string;
    description?: string;
    image?: string;
    creationDate?: string;
}

@Component({
    selector: 'idt-case-carousel',
    templateUrl: 'case-carousel.component.html',
    styleUrls: ['./case-carousel.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CaseCarouselComponent {
    @Input() slides: CarouselSlide[];
    @Input() selected = 0;

    prev(): void {
        const index = this.selected <= 0 ? this.slides.length - 1 : this.selected - 1;
        this.selected = index;
    }

    next(): void {
        const index = this.selected >= this.slides.length - 1 ? 0 : this.selected + 1;
        this.selected = index;
    }

    getLeftPosition(): string {
        return 'translateX(' + this.selected * (-100) + '%)';
    }

    getCaseLink(id: string) {
        return '/cases/' + id;
    }
}
