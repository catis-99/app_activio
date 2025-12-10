import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntroSlider3Page } from './intro-slider-3.page';

describe('IntroSlider3Page', () => {
    let component: IntroSlider3Page;
    let fixture: ComponentFixture<IntroSlider3Page>;

    beforeEach(() => {
        fixture = TestBed.createComponent(IntroSlider3Page);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
