using System;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;


namespace TRAISI.Questions.TripDiary
{
    [SurveyQuestion(QuestionResponseType.String)]
	[QuestionPartSlot(SlotName="Initial Slot")]
    public class TripDiaryQuestion : ISurveyQuestion
    {
        public string TypeName {
			get => "Trip Diary";
		}
		public string Icon {
			get => "map";
		}



		public QuestionIconType IconType { get => QuestionIconType.FONT; }
    }
}
