import { ColorPreference } from '@/app/components/tips/color-preference/color-preference';
import { TightsCombination } from '@/app/components/tips/tights-combination/tights-combination';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TightsCaution } from "@/app/components/tips/tights-caution/tights-caution";
import { HeelProtectors } from "@/app/components/tips/heel-protectors/heel-protectors";
import { ShoeBrush } from "@/app/components/tips/shoe-brush/shoe-brush";

@Component({
  selector: 'app-faq-details',
  imports: [CommonModule, ColorPreference, TightsCombination, TightsCaution, HeelProtectors, ShoeBrush],
  templateUrl: './faq-details.html',
  styleUrl: './faq-details.scss',
})
export class FaqDetails implements OnInit {
  private _faqId!: string;
  set setFaqId(faqId: string) {
    this._faqId = faqId;
  }

  get faqId() {
    return this._faqId;
  }

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    const ID = this.route.snapshot.paramMap.get('id');
    if (ID) this.setFaqId = ID;
  }
}
