import { NgModule } from '@angular/core';
import { PopperContentComponent } from './components/popper-content.component';
import { CommonModule } from '@angular/common';
@NgModule({
	imports: [CommonModule],
	entryComponents: [PopperContentComponent],
	declarations: [PopperContentComponent],
	exports: [PopperContentComponent]
})
export class UtilModule {}
