using System;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK.Questions {
	[SurveyQuestion(QuestionResponseType.Integer,
		CodeBundleName = "traisi-trip-diary-timeline.module.js")]
	public class TripDiaryTimeline : ISurveyQuestion {
		public string TypeName => "trip-diary-timeline";

		public string Icon {
			get => "fas fa-business-time";
		}

		public QuestionIconType IconType {
			get => QuestionIconType.FONT;
		}

		[QuestionConfiguration(QuestionConfigurationValueType.Time,
			Name = "Start Time",
			Description = "Start time of the day",
			SurveyBuilderValueType = QuestionBuilderType.Time,
			DefaultValue = "3:00")]
		public string StartTime = "StartTime";

		[QuestionOption(QuestionOptionValueType.String,
			Name = "Trip Purposes")]
		public string Purpose;
	}
}