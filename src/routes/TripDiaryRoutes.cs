using System;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK.Questions
{
    //[SurveyQuestion(QuestionResponseType.Integer)]
    public class TripDiaryRoutes 
    {
        public string TypeName => "trip-diary-routes";

        public string Icon
        {
            get => "fas fa-sort-route";
        }
        public QuestionIconType IconType { get => QuestionIconType.FONT; }
    }
}