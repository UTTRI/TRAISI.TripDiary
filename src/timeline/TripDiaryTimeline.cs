using System;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK.Questions
{
    [SurveyQuestion(QuestionResponseType.Timeline,
        CodeBundleName = "traisi-trip-diary-timeline.module.js",
        InternalNavigationViewCount = 2,
        ModuleDependencies = new string[] { "location" }

        )]
    public class TripDiaryTimeline : ISurveyQuestion
    {
        public string TypeName => "trip-diary-timeline";

        public string Icon
        {
            get => "fas fa-business-time";
        }

        public QuestionIconType IconType
        {
            get => QuestionIconType.FONT;
        }

        [QuestionConfiguration(ConfigurationValueType.Time,
            Name = "Start Time",
            Description = "Start time of the day",
            SurveyBuilderValueType = QuestionBuilderType.Time,
            DefaultValue = "3:00")]
        public string StartTime = "StartTime";

        [QuestionConfiguration(ConfigurationValueType.Custom,
            Name = "Purpose",
            Description = "Purpose of being at location.",
            SurveyBuilderValueType = QuestionBuilderType.MultiSelect,
            DefaultValue = "home",
            SharedResource = "mapquestion-purpose")]
        public string[] Purposes = new string[] { };


        [QuestionConfiguration(ConfigurationValueType.Boolean,
        Name = "Departure Time Collection",
        Description = "A flag that will turn off the collecting of departure times from users",
            SurveyBuilderValueType = QuestionBuilderType.Switch,
            DefaultValue = "false")]

        public bool CollectDepartureTime = true;


        [QuestionConfiguration(ConfigurationValueType.Boolean,
        Name = "Arrival Time Collection",
        Description = "A flag that will turn off the collecting of arrival times from users",
            SurveyBuilderValueType = QuestionBuilderType.Switch,
            DefaultValue = "false")]
        public bool CollectArrivalTime = false;

    }
}