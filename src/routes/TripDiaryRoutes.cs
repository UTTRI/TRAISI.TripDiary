using System;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK.Questions
{
    [SurveyQuestion(QuestionResponseType.Json,
    CodeBundleName = "traisi-trip-diary-routes.module.js")]
    public class TripDiaryRoutes: ISurveyQuestion
    {
        public string TypeName => "trip-diary-routes";

        public string Icon
        {
            get => "fas fa-route";
        }
        public QuestionIconType IconType { get => QuestionIconType.FONT; }
    }
}